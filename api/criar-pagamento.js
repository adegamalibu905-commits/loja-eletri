const fs=require('fs'),path=require('path');
const ler=n=>JSON.parse(fs.readFileSync(path.join(process.cwd(),'data',n)));
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const{itens,cep,cupom}=req.body||{};
 const P=ler('produtos.json'),C=ler('config.json');
 let total=0;
 for(const i of itens||[]){const p=P.find(x=>x.id===i.id&&x.ativo);if(!p||!(i.qtd>0)||i.qtd>p.estoque)return res.status(400).json({erro:'item inválido'});total+=p.preco*i.qtd}
 total*=1-(C.cupons[(cupom||'').toUpperCase()]||0)/100;
 if(total<C.frete.gratis_acima)total+=C.frete.regioes[(cep||'0')[0]]??C.frete.base;
 total=Math.round(total*100)/100;
 const r=await fetch('https://wallet.ravenbot.com.br/api/pix/create',{method:'POST',headers:{'x-api-key':process.env.RAVEN_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({amount:total,description:'Pedido '+C.nome,external_id:'pedido-'+Date.now(),expiration:1800})});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||!j.transaction)return res.status(502).json({erro:j.error||j.message||'falha no gateway'});
 const t=j.transaction;let qr='',copia='';
 for(const v of Object.values(t))if(typeof v==='string'){
  if(v.startsWith('000201'))copia=v;
  else if(v.startsWith('data:image'))qr=v;
  else if(v.length>200&&/^[A-Za-z0-9+/=]+$/.test(v))qr='data:image/png;base64,'+v;
 }
 res.json({id:t.id,total,qr,copia,expira:t.expires_at});
};