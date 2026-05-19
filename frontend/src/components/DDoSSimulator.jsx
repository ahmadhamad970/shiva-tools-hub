import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

export default function DDoSSimulator(){
  const [target, setTarget] = useState('example.test')
  const [bots, setBots] = useState(5000)
  const [attackType, setAttackType] = useState('HTTP Flood')
  const [layer, setLayer] = useState('L7')
  const [duration, setDuration] = useState(30)
  const [running, setRunning] = useState(false)
  const [stats, setStats] = useState({rps:0,cpu:0,mem:0,errors:0,elapsed:0})
  const [analysis, setAnalysis] = useState(null)
  const [simId, setSimId] = useState(null)

  const rpsChartRef = useRef(null)
  const cpuChartRef = useRef(null)
  const statsRef = useRef(stats)
  useEffect(()=>{ statsRef.current = stats }, [stats])

  useEffect(()=>{
    try{
      const canvasRps = document.getElementById('rpsChart')
      const canvasCpu = document.getElementById('cpuChart')
      const ctx = canvasRps?.getContext('2d')
      const ctx2 = canvasCpu?.getContext('2d')
      if(!ctx || !ctx2) return

      // destroy any existing charts attached to these canvases (HMR safety)
      const existingRps = Chart.getChart(canvasRps)
      if(existingRps) existingRps.destroy()
      const existingCpu = Chart.getChart(canvasCpu)
      if(existingCpu) existingCpu.destroy()

      rpsChartRef.current = new Chart(ctx, { type:'line', data:{ labels:[], datasets:[{ label:'RPS', data:[], borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.06)', tension:0.3 }]}, options:{ responsive:true } })
      cpuChartRef.current = new Chart(ctx2, { type:'line', data:{ labels:[], datasets:[{ label:'CPU %', data:[], borderColor:'#fb7185', backgroundColor:'rgba(251,113,133,0.06)', tension:0.3 }]}, options:{ responsive:true, scales:{ y:{ beginAtZero:true, max:100 } } } })
    }catch(err){ console.warn('Chart init failed', err) }
  }, [])

  function updateCharts(point){
    const t = new Date(point.t).toLocaleTimeString()
    const rpsChart = rpsChartRef.current
    const cpuChart = cpuChartRef.current
    if(!rpsChart || !cpuChart) return
    rpsChart.data.labels.push(t); rpsChart.data.datasets[0].data.push(point.rps); if(rpsChart.data.labels.length>60){ rpsChart.data.labels.shift(); rpsChart.data.datasets[0].data.shift() }
    cpuChart.data.labels.push(t); cpuChart.data.datasets[0].data.push(point.cpu); if(cpuChart.data.labels.length>60){ cpuChart.data.labels.shift(); cpuChart.data.datasets[0].data.shift() }
    rpsChart.update(); cpuChart.update();
  }

  // expose current layer for animation logic (used by canvas effect)
  useEffect(()=>{ window.__SIM_LAYER = layer }, [layer])

  function startSimulation(e){
    e && e.preventDefault(); setRunning(true); setStats({rps:0,cpu:0,mem:0,errors:0,elapsed:0}); setAnalysis(null)
    fetch('/api/start', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ target, bots, duration, attackType, layer }) }).then(r=>r.json()).then(data=>{
      const id = data.id; setSimId(id)
      const es = new EventSource('/api/events/' + id)
      es.onmessage = ev => { try{ const p = JSON.parse(ev.data); setStats(p); updateCharts(p) }catch(err){} }
      es.addEventListener('analysis', ev => { try{ setAnalysis(JSON.parse(ev.data)) }catch(e){} })
      es.addEventListener('done', ()=>{ setRunning(false); es.close() })
      es.onerror = ()=>{ es.close(); setRunning(false) }
    }).catch(err=>{ setRunning(false) })
  }

  // Canvas tube animation effect (visual differences per layer)
  useEffect(()=>{
    const canvas = document.getElementById('packetCanvas')
    if(!canvas) return
    const pctx = canvas.getContext('2d')
    const particles = []
    const emitters = [ {x:20,y:40},{x:20,y:80},{x:20,y:120} ]
    let animId = null

    function spawnParticles(rate){
      const count = Math.min(500, Math.floor(rate/20))
      for(let i=0;i<count;i++){
        const e = emitters[Math.floor(Math.random()*emitters.length)]
        const p = {
          x: e.x + Math.random()*20,
          y: e.y + (Math.random()*10-5),
          life: 100 + Math.random()*160,
          size: 3,
          alpha: 0.7 + Math.random()*0.3,
          vx: 1 + Math.random()*3,
          color: '#60a5fa'
        }
        const L = window.__SIM_LAYER || 'L7'
        if(L === 'L3'){ p.size = 6; p.vx += 2; p.color = '#34d399' }
        else if(L === 'L4'){ p.size = 4; p.vx += 1.2; p.color = '#fb923c' }
        else { p.size = 2; p.vx += 0.6; p.color = '#60a5fa' }
        particles.push(p)
      }
    }

    function animate(){
      if(!pctx || !canvas) return
      pctx.clearRect(0,0,canvas.width,canvas.height)
      // draw tube background
      const tubeX = 40
      const tubeY = canvas.height/2 - 30
      const tubeW = canvas.width - 160
      const tubeH = 60
      pctx.fillStyle = '#072639'; pctx.fillRect(tubeX-8, tubeY-8, tubeW+16, tubeH+16)
      pctx.fillStyle = '#02263a'; pctx.fillRect(tubeX, tubeY, tubeW, tubeH)
      // draw server
      pctx.fillStyle = '#0ea5a4'; pctx.beginPath(); pctx.arc(canvas.width-80, canvas.height/2, 30, 0, Math.PI*2); pctx.fill(); pctx.fillStyle='#e6eef8'; pctx.font='12px Arial'; pctx.fillText('SERVER', canvas.width-112, canvas.height/2+5)

      for(let i=particles.length-1;i>=0;i--){
        const p = particles[i]
        p.x += p.vx
        p.life -= 1
        pctx.fillStyle = p.color || '#60a5fa'
        pctx.globalAlpha = p.alpha
        pctx.fillRect(p.x, tubeY + (tubeH/4) + (p.y%10), p.size, Math.max(2,p.size/1.5))
        pctx.globalAlpha = 1
        if(p.x > canvas.width-120 || p.life <= 0) particles.splice(i,1)
      }

      animId = requestAnimationFrame(animate)
    }

    animate()
    const spawnInterval = setInterval(()=>{ const latest = statsRef.current || { rps:0 }; spawnParticles(latest.rps || 0) }, 250)

    return ()=>{ cancelAnimationFrame(animId); clearInterval(spawnInterval) }
  }, [])

  function downloadReport(){ if(!simId) return alert('No simulation id'); fetch('/api/logs/'+simId).then(r=>r.text()).then(txt=>{ const blob=new Blob([txt],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`report-${simId}.txt`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url) }).catch(()=>alert('Report not available')) }
  function downloadTelemetry(){ if(!simId) return alert('No simulation id'); fetch('/api/telemetry/'+simId).then(r=>r.json()).then(json=>{ const blob=new Blob([JSON.stringify(json,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`telemetry-${simId}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url) }).catch(()=>alert('Telemetry not available')) }

  return (
    <div style={{padding:12,background:'#071226',borderRadius:8,maxWidth:980}}>
      <h2 style={{fontSize:18,fontWeight:700,marginBottom:8}}>DDoS Attack Simulator — Demo</h2>
      <form onSubmit={startSimulation} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div>
          <label>Target</label>
          <input style={{width:'100%',padding:8,marginTop:6,marginBottom:6}} value={target} onChange={e=>setTarget(e.target.value)} />
          <label>Bots</label>
          <input type="number" style={{width:'100%',padding:8,marginTop:6}} value={bots} onChange={e=>setBots(Number(e.target.value))} />
          <label style={{marginTop:8}}>Attack Type</label>
          <select style={{width:'100%',padding:8,marginTop:6}} value={attackType} onChange={e=>setAttackType(e.target.value)}>
            <option>HTTP Flood</option>
            <option>SYN Flood</option>
            <option>Amplification</option>
          </select>
        </div>
        <div>
          <label>Layer</label>
          <select style={{width:'100%',padding:8,marginBottom:8}} value={layer} onChange={e=>setLayer(e.target.value)}>
            <option value="L3">L3 (Network)</option>
            <option value="L4">L4 (Transport)</option>
            <option value="L7">L7 (Application)</option>
          </select>
          <label>Duration (sec)</label>
          <input type="number" style={{width:'100%',padding:8,marginTop:6}} value={duration} onChange={e=>setDuration(Number(e.target.value))} />
          <div style={{marginTop:8}}>
            <button style={{padding:'8px 12px',marginRight:8}} disabled={running}>{running? 'Running...':'Start'}</button>
            <button type="button" style={{padding:'8px 12px'}} onClick={()=>window.location.reload()}>Reset</button>
          </div>
        </div>
      </form>

      <div style={{marginTop:10,display:'flex',gap:12}}>
        <div style={{flex:1,background:'#021524',padding:10,borderRadius:6}}>
          <strong>Layer explanation</strong>
          <p style={{marginTop:8,opacity:0.9,fontSize:13}}>
            {layer === 'L3' && 'L3 (Network): Simulates raw packet floods at the IP level. Packets are larger and faster, showing heavy bandwidth usage.'}
            {layer === 'L4' && 'L4 (Transport): Simulates floods targeting TCP/UDP (SYN/UDP). Shows medium packets with connection exhaustion characteristics.'}
            {layer === 'L7' && 'L7 (Application): Simulates HTTP-level floods. Many small requests, higher CPU load and application impact.'}
          </p>
        </div>
        <div style={{width:420}}>
          <div style={{background:'#031026',padding:10,borderRadius:6}}>
            <canvas id="packetCanvas" width="400" height="160" style={{background:'#031026',display:'block'}}></canvas>
          </div>
        </div>
      </div>

      <div style={{display:'flex',gap:8,marginTop:12}}>
        <div style={{flex:1,background:'#031026',padding:10,borderRadius:6}}>
          <div style={{fontSize:20,fontWeight:800}}>{stats.rps}</div>
          <div style={{opacity:0.8}}>RPS</div>
        </div>
        <div style={{flex:1,background:'#031026',padding:10,borderRadius:6}}>
          <div style={{fontSize:20,fontWeight:800}}>{stats.cpu}%</div>
          <div style={{opacity:0.8}}>CPU</div>
        </div>
        <div style={{flex:1,background:'#031026',padding:10,borderRadius:6}}>
          <div style={{fontSize:20,fontWeight:800}}>{stats.mem}%</div>
          <div style={{opacity:0.8}}>Memory</div>
        </div>
      </div>

      <div style={{marginTop:12,background:'#031026',padding:10,borderRadius:6}}>
        <canvas id="rpsChart" height="120"></canvas>
      </div>
      <div style={{marginTop:8,background:'#031026',padding:10,borderRadius:6}}>
        <canvas id="cpuChart" height="120"></canvas>
      </div>

      {analysis && (
        <div style={{marginTop:12,background:'#081226',padding:10,borderRadius:6}}>
          <h3 style={{fontWeight:700}}>Analysis Summary</h3>
          <div>Peak RPS: {analysis.peakRps}</div>
          <div>Impact Score: {analysis.impactScore}%</div>
          <div style={{marginTop:8}}>
            <button style={{padding:8,marginRight:8}} onClick={downloadReport}>Download Report</button>
            <button style={{padding:8}} onClick={downloadTelemetry}>Download Telemetry</button>
          </div>
        </div>
      )}
    </div>
  )
}
