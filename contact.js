/* Contact form: Firestore + EmailJS (unchanged logic) */
(function(){
var FB=window.FB,db=FB.db,$=FB.$,wait=FB.wait,MSG=FB.MSG,LIM=FB.LIM,LIMIT_MS=FB.LIMIT_MS,MY_EMAIL=FB.MY_EMAIL,EJS=FB.EJS;
/* ---------- 1. CONTACT FORM ---------- */
var f=$("cf"),st=$("fst"),btn=$("cb");
function say(t,c){st.className=c||"";st.textContent=t}
f.addEventListener("submit",async function(ev){
  ev.preventDefault();
  if(f.website.value)return; /* honeypot: bots fill this */
  var name=f.name.value.trim(),email=f.email.value.trim(),subject=f.subject.value.trim()||"Portfolio contact",message=f.message.value.trim();
  if(!name||!message){say("Please enter your name and message.","er");return}
  if(!/^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(email)){say("Please enter a valid email address.","er");return}
  var key=email.toLowerCase(),LIMMSG="A message from this email was already sent in the last 24 hours. Please try again later, or email me directly at "+MY_EMAIL+".";
  var lm={};try{lm=JSON.parse(localStorage.getItem("cf_lim")||"{}")}catch(e){}
  if(lm[key]&&Date.now()-lm[key]<LIMIT_MS){say(LIMMSG,"er");return}
  btn.disabled=true;say("Sending…");
  var saved=false,blocked=false,mailed=false,userMailed=false;
  /* Save to Firestore. Message + per-email limit doc are written together; the server rules reject it if this email wrote in the last 24h. */
  if(db){
    try{
      var ts=firebase.firestore.FieldValue.serverTimestamp(),b=db.batch();
      b.set(db.collection(LIM).doc(key),{last:ts});
      b.set(db.collection(MSG).doc(),{name:name,email:email,emailKey:key,subject:subject,message:message,page:"portfolio",createdAt:ts});
      await b.commit();saved=true;
    }catch(e){if(e&&e.code==="permission-denied")blocked=true;else console.warn("Firestore failed",e)}
  }
  if(blocked){btn.disabled=false;say(LIMMSG,"er");return}
  if(window.emailjs){
    /* mail 1: to admin (me) */
    try{var r=await emailjs.send(EJS.SERVICE_ID,EJS.TEMPLATE_ID,{to_email:MY_EMAIL,to_name:"Shivdhan",from_name:name,reply_to:email,from_email:email,subject:"[Portfolio] "+subject,message:"New message from your portfolio\n\nName: "+name+"\nEmail: "+email+"\nSubject: "+subject+"\n\n"+message});mailed=r.status===200}catch(e){console.warn("EmailJS admin mail failed",e)}
    await wait(1200); /* EmailJS free plan: ~1 request/second */
    /* mail 2: confirmation to the visitor */
    try{var r2=await emailjs.send(EJS.SERVICE_ID,EJS.TEMPLATE_ID,{to_email:email,to_name:name,from_name:"Shivdhan Shirgole",reply_to:MY_EMAIL,subject:"Thanks for contacting Shivdhan Shirgole",message:"Hi "+name+",\n\nThank you for reaching out! I have received your message and will reply to you soon.\n\nYour message:\nSubject: "+subject+"\n"+message+"\n\nRegards,\nShivdhan Shirgole\nPython Full Stack Developer\n"+MY_EMAIL+" | +91-9049418836"});userMailed=r2.status===200}catch(e){console.warn("EmailJS user mail failed",e)}
  }
  btn.disabled=false;
  if(saved||mailed){
    say("Thank you, "+name.split(" ")[0]+"! Your message was sent."+(userMailed?" A confirmation was sent to your email.":""),"ok");
    f.reset();lm[key]=Date.now();try{localStorage.setItem("cf_lim",JSON.stringify(lm))}catch(e){}
  }else say("Could not send right now. Please email me directly at "+MY_EMAIL+".","er");
});
})();
