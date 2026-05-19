import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

export default function DDoSSimulator(){
  const [target, setTarget] = useState('example.test')
  const [bots, setBots] = useState(5000)
  const [attackType, setAttackType] = useState('HTTP Flood')
  const [layer, setLayer] = useState('L7')
  const [duration, setDuration] = useState(30)
  const [running, setRunning] = useState(false)
  const [stats, setStats] = useState({rps:0,cpu:0,mem:0,errors:0,elapsed:0,progress:0})
  const [analysis, setAnalysis] = useState(null)
  const [simId, setSimId] = useState(null)

  const rpsChartRef = useRef(null)
  const cpuChartRef = useRef(null)
  const statsRef = useRef(stats)

  useEffect(()=>{ statsRef.current = stats }, [stats])

  useEffect(()=>{
    const ctx = document.getElementById('rpsChart')?.getContext('2d')
    const ctx2 = document.getElementById('cpuChart')?.getContext('2d')
    if(!ctx || !ctx2) return
    rpsChartRef.current = new Chart(ctx, { type:'line', data:{ labels:[], datasets:[{ label:'RPS', data:[], borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.06)', tension:0.3 }]}, options:{ responsive:true } })
    cpuChartRef.current = new Chart(ctx2, { type:'line', data:{ labels:[], datasets:[{ label:'CPU %', data:[], borderColor:'#fb7185', backgroundColor:'rgba(251,113,133,0.06)', tension:0.3 }]}, options:{ responsive:true, scales:{ y:{ beginAtZero:true, max:100 } } } })

    // packet canvas
    const canvas = document.getElementById('packetCanvas')
    const pctx = canvas?.getContext('2d')
    const particles = []
    const emitters = [ {x:20,y:30},{x:20,y:80},{x:20,y:130},{x:120,y:50},{x:120,y:110} ]
    let animId = null

    function spawnParticles(rate){
      const count = Math.min(300, Math.floor(rate/40))
      for(let i=0;i<count;i++){ const e = emitters[Math.floor(Math.random()*emitters.length)]; particles.push({ x: e.x + Math.random()*20, y: e.y + (Math.random()*20-10), vx: 1 + Math.random()*4, life: 120 + Math.random()*200, alpha: 0.6 + Math.random()*0.4 }) }
    }

    function animate(){
      if(!pctx || !canvas) return
      pctx.clearRect(0,0,canvas.width,canvas.height)
      emitters.forEach(em=>{ pctx.fillStyle='#38bdf8'; pctx.beginPath(); pctx.arc(em.x, em.y, 6, 0, Math.PI*2); pctx.fill() })
      pctx.fillStyle = '#0ea5a4'; pctx.beginPath(); pctx.arc(canvas.width-60, canvas.height/2, 26, 0, Math.PI*2); pctx.fill(); pctx.fillStyle='#e6eef8'; pctx.font='12px Arial'; pctx.fillText('SERVER', canvas.width-92, canvas.height/2+4)
      for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx; p.life-=1; pctx.fillStyle=`rgba(96,165,250,${p.alpha})`; pctx.fillRect(p.x,p.y,4,2); if(p.x>canvas.width-80||p.life<=0) particles.splice(i,1) }
      animId = requestAnimationFrame(animate)
    }
    animate()
    const spawnInterval = setInterval(()=>{ const latest = statsRef.current || { rps:0 }; spawnParticles(latest.rps || 0) }, 350)

    return ()=>{ cancelAnimationFrame(animId); clearInterval(spawnInterval) }
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

  function startSimulation(e){
    e && e.preventDefault(); setRunning(true); setStats({rps:0,cpu:0,mem:0,errors:0,elapsed:0,progress:0}); setAnalysis(null)
    fetch('/api/start', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ target, bots, attackType, layer, duration }) }).then(r=>r.json()).then(data=>{
      const id = data.id; setSimId(id)
      const es = new EventSource('/api/events/' + id)
      es.onmessage = ev => { try{ const p = JSON.parse(ev.data); setStats(p); updateCharts(p) }catch(err){} }
      es.addEventListener('analysis', ev => { try{ setAnalysis(JSON.parse(ev.data)) }catch(e){} })
      es.addEventListener('done', ()=>{ setRunning(false); es.close() })
      es.onerror = ()=>{ es.close(); setRunning(false) }
    }).catch(err=>{ setRunning(false) })
  }

  function downloadReport(){ if(!simId) return alert('No simulation id'); fetch('/api/logs/'+simId).then(r=>r.text()).then(txt=>{ const blob=new Blob([txt],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`report-${simId}.txt`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url) }).catch(()=>alert('Report not available')) }
  function downloadTelemetry(){ if(!simId) return alert('No simulation id'); fetch('/api/telemetry/'+simId).then(r=>r.json()).then(json=>{ const blob=new Blob([JSON.stringify(json,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`telemetry-${simId}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url) }).catch(()=>alert('Telemetry not available')) }

  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">DDoS Attack Simulator — Demo</h2>
      <form onSubmit={startSimulation} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Target (label only)</label>
          <input className="mt-1 p-2 rounded bg-slate-800 w-full" value={target} onChange={e=>setTarget(e.target.value)} />
          <label className="block text-sm mt-2">Number of bots</label>
          <input type="number" className="mt-1 p-2 rounded bg-slate-800 w-full" value={bots} onChange={e=>setBots(Number(e.target.value))} />
          <label className="block text-sm mt-2">Attack Type</label>
          <select className="mt-1 p-2 rounded bg-slate-800 w-full" value={attackType} onChange={e=>setAttackType(e.target.value)}>
            <option>HTTP Flood</option>
            <option>SYN Flood</option>
            <option>Amplification</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Layer</label>
          <select className="mt-1 p-2 rounded bg-slate-800 w-full" value={layer} onChange={e=>setLayer(e.target.value)}>
            <option>L3</option>
            <option>L4</option>
            <option>L7</option>
          </select>
          <label className="block text-sm mt-2">Duration (seconds)</label>
          <input type="number" className="mt-1 p-2 rounded bg-slate-800 w-full" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
          <div className="mt-3">
            <button className="px-3 py-2 bg-blue-600 rounded mr-2" disabled={running}>{running? 'Running...':'Start'}</button>
            <button type="button" className="px-3 py-2 bg-slate-700 rounded" onClick={()=>{ setRunning(false); window.location.reload() }}>Reset</button>
          </div>
        </div>
      </form>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-800 rounded"> <div className="text-2xl font-bold">{stats.rps}</div><div className="text-sm">RPS</div></div>
        <div className="p-3 bg-slate-800 rounded"> <div className="text-2xl font-bold">{stats.cpu}%</div><div className="text-sm">CPU</div></div>
        <div className="p-3 bg-slate-800 rounded"> <div className="text-2xl font-bold">{stats.mem}%</div><div className="text-sm">Memory</div></div>
      </div>

      <div className="mt-4 bg-slate-800 p-3 rounded">
        <canvas id="rpsChart" height="120"></canvas>
      </div>
      <div className="mt-3 bg-slate-800 p-3 rounded">
        <canvas id="cpuChart" height="120"></canvas>
      </div>

      <div className="mt-3 bg-slate-800 p-3 rounded">
        <h3 className="font-semibold">Traffic Animation</h3>
        <canvas id="packetCanvas" width="900" height="160" className="mt-2 rounded" style={{background:'#031026'}}></canvas>
      </div>

      {analysis && (
        <div className="mt-4 bg-slate-800 p-3 rounded">
          <h3 className="text-lg font-bold">Analysis Summary</h3>
          <div className="mt-2">Attack: {analysis.attackType} — {analysis.layer}</div>
          <div>Target: {analysis.target}</div>
          <div>Peak RPS: {analysis.peakRps}</div>
          <div>Impact Score: {analysis.impactScore}%</div>
          <div>Estimated downtime probability: {analysis.downtimeProb}%</div>
          <div className="mt-2">
            <button className="px-3 py-2 bg-slate-700 rounded mr-2" onClick={downloadReport}>Download Report</button>
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={downloadTelemetry}>Download Telemetry (JSON)</button>
          </div>
        </div>
      )}
    </div>
  )
}
