import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

const simulations = new Map()
const clients = new Map()
const logs = new Map()
const telemetry = new Map()

function createId(){ return String(Date.now()) + '-' + Math.random().toString(36).slice(2,8) }

app.post('/api/start', (req,res) => {
  const { target='demo.test', bots=1000, duration=30 } = req.body || {}
  const id = createId()
  const sim = { id, target, bots, duration, startedAt: Date.now(), maxRps:0, running:true }
  simulations.set(id, sim)
  logs.set(id, `Simulation ${id} started for ${target}\n`)
  telemetry.set(id, [])

  // start generating metrics
  let elapsed = 0
  const interval = setInterval(()=>{
    elapsed += 1
    const rps = Math.max(0, Math.round((Math.random()*0.6 + 0.4) * bots * (0.6 + Math.random()*0.8)))
    const cpu = Math.min(100, Math.round((rps / Math.max(1,bots)) * 100 * (0.4 + Math.random()*0.8)))
    const mem = Math.min(100, Math.round(20 + Math.random()*60))
    const errors = Math.round(Math.random()*5)
    const point = { t: Date.now(), rps, cpu, mem, errors, elapsed, progress: Math.round((elapsed/duration)*100) }
    telemetry.get(id).push(point)
    logs.set(id, logs.get(id) + `t=${point.t} rps=${rps} cpu=${cpu} mem=${mem}\n`)
    // broadcast if client connected
    const resObj = clients.get(id)
    if(resObj){ resObj.write(`data: ${JSON.stringify(point)}\n\n`) }
    if(rps > sim.maxRps) sim.maxRps = rps
    if(elapsed >= duration){
      clearInterval(interval)
      sim.running = false
      const analysis = {
        id,
        target: sim.target,
        peakRps: sim.maxRps,
        impactScore: Math.min(100, Math.round((sim.maxRps / Math.max(1, bots)) * 100)),
        downtimeProb: Math.min(100, Math.round((sim.maxRps / Math.max(1, bots)) * 50)),
        attackType: 'HTTP Flood',
        layer: 'L7'
      }
      logs.set(id, logs.get(id) + `ANALYSIS: ${JSON.stringify(analysis)}\n`)
      // send analysis event
      const r = clients.get(id)
      if(r){ r.write(`event: analysis\n`); r.write(`data: ${JSON.stringify(analysis)}\n\n`); r.write(`event: done\n`); r.write(`data: done\n\n`); r.end() }
    }
  }, 1000)

  sim._interval = interval
  res.json({ id })
})

app.get('/api/events/:id', (req,res) => {
  const { id } = req.params
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
  res.flushHeaders && res.flushHeaders()
  clients.set(id, res)
  req.on('close', ()=>{ clients.delete(id) })
})

app.get('/api/logs/:id', (req,res)=>{
  const id = req.params.id
  res.type('text/plain').send(logs.get(id) || 'No logs')
})

app.get('/api/telemetry/:id', (req,res)=>{
  const id = req.params.id
  res.json(telemetry.get(id) || [])
})

// serve frontend build if present
const frontPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontPath))
app.get('*', (req,res)=>{ res.sendFile(path.join(frontPath, 'index.html'), err=>{ if(err) res.status(404).send('Not Found') }) })

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`Sh!Va backend running on http://localhost:${PORT}`))
