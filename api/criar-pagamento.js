// Função serverless (Vercel/Netlify). O preço é recalculado AQUI, nunca confie no navegador.
const fs=require('fs'),path=require('path');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const{itens,cliente,cep,cupom}=req.body||{};
 const P=JSON.parse(fs.readFileSync(path.join(process.cwd(),'data/produtos.json')));
 const C=JSON.parse(fs.readFileSync(path.join(process.cwd(),'data/config.json')));
 let total=0;
 for(const i of itens||[]){const p=P.find(x=>x.id===i.id&&x.ativo);if(!p||!(i.qtd>0)||i.qtd>p.estoque)return res.status(400).json({erro:'item inválido'});total+=p.preco*i.qtd}
 total*=1-(C.cupons[(cupom||'').toUpperCase()]||0)/100;
 if(total<C.frete.gratis_acima)total+=C.frete.regioes[(cep||'0')[0]]??C.frete.base;
 // >>> RAVEN: ajuste URL e campos conforme a documentação do gateway <<<
 const r=await fetch(process.env.RAVEN_API_URL,{method:'POST',headers:{Authorization:'Bearer '+process.env.RAVEN_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({valor:Math.round(total*100),cliente})});
 const j=await r.json();
 res.json({url:j.url||j.checkout_url});
};
