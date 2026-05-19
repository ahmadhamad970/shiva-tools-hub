import React from 'react'
import DDoSSimulator from './components/DDoSSimulator'

export default function App(){
  return (
    <div style={{minHeight:'100vh',background:'#020617',color:'#fff',padding:20,fontFamily:'Inter, Arial'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800}}>Sh!Va — DDoS Simulator</h1>
        <div style={{textAlign:'right',fontSize:12}}>
          <div>Built by <strong>Ahmad Hamad</strong></div>
          <div style={{opacity:0.8}}>Alias: <strong>Sh!Va</strong></div>
        </div>
      </header>

      <main>
        <DDoSSimulator />
      </main>

      <footer style={{marginTop:40,opacity:0.7,fontSize:12}}>© 2026 Ahmad Hamad / Sh!Va</footer>
    </div>
  )
}
