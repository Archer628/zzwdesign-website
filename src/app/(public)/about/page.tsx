import { db } from '@/lib/db';
import Link from 'next/link';
import { Arrow, Description } from '@/components/site';
import { MediaImage } from '@/components/media-image';
import { aboutSections, experienceRows } from '@/lib/about';
import styles from './about.module.css';

export const dynamic='force-dynamic';
export const metadata={title:'关于我'};

export default async function Page(){
 const values=Object.fromEntries((await db.setting.findMany({where:{key:{startsWith:'about'}}})).map(s=>[s.key,s.value]));
 const {intro,skills,sections}=aboutSections(values.aboutContent||'[]');
 const lastIntro=intro.at(-1);
 const summary=lastIntro?.type==='paragraph'?lastIntro:undefined;
 const facts=summary?intro.slice(0,-1):intro;
 const contactIndex=sections.findIndex(s=>s.title==='联系我');
 return <main className={styles.about}>
  <section className={styles.hero} aria-labelledby="about-title">
   <div className={styles.heroCopy}>
    <p className={styles.eyebrow}>ABOUT ME</p>
    <h1 id="about-title">邹智文<span>.</span></h1>
    <p className={styles.role}>UI/UX 设计师</p>
    <p className={styles.tagline}>{skills[0]&&`${skills[0].text}，`}{summary?.text||'专注于创造简洁、高效、美观的数字产品体验。'}</p>
    {facts.length>0&&<div className={styles.intro}><Description value={JSON.stringify(facts)}/></div>}
    {skills.length>1&&<ul className={styles.skills} aria-label="专业方向">{skills.slice(1).map((skill,i)=><li key={i}>{skill.text}</li>)}</ul>}
    <div className={styles.actions}>
     <Link className={styles.primary} href="/works">全部案例<Arrow/></Link>
     {contactIndex>=0&&<a className={styles.secondary} href={`#about-section-${contactIndex}`}>联系我<Arrow/></a>}
    </div>
   </div>
   {values.aboutPortrait&&<figure className={styles.portrait}>
    <MediaImage src={values.aboutPortrait} alt="邹智文的绿色机器人头像" loading="eager"/>
    <figcaption>邹智文.</figcaption>
   </figure>}
   {sections.length>0&&<nav className={styles.sectionNav} aria-label="关于我页面章节">{sections.map((section,i)=><a key={i} href={`#about-section-${i}`}>{section.title}</a>)}</nav>}
  </section>
  {sections.map((section,i)=>{
   const rows=section.title==='工作经历'?experienceRows(section.content):null;
   const contact=section.title==='联系我';
   const invitation=contact&&section.content[0]?.type==='paragraph'&&!section.content[0].text.includes('@')?section.content[0]:null;
   return <section className={contact?styles.contact:styles.resume} id={`about-section-${i}`} aria-labelledby={`about-heading-${i}`} tabIndex={-1} key={i}>
    <header className={styles.sectionHeading}>
     {section.kicker&&<p className={styles.eyebrow}>{section.kicker}</p>}
     <h2 id={`about-heading-${i}`}>{section.title}</h2>
     {invitation&&<p className={styles.invitation}>{invitation.text}</p>}
     <Link className={styles.textLink} href="/works">全部案例<Arrow/></Link>
    </header>
    {rows?<ol className={styles.jobs}>{rows.map((row,j)=><li className={styles.job} key={j}>
     <div><p className={styles.date}>{row.date}</p><h3>{row.company}</h3><p className={styles.jobRole}>{row.role}</p></div>
     <Description value={JSON.stringify(row.description)}/>
    </li>)}</ol>:contact?<div className={styles.contactDetails}>{section.content.slice(invitation?1:0).map((block,j)=>{
     if(block.type!=='paragraph')return <Description value={JSON.stringify([block])} key={j}/>;
     const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(block.text);
     return email?<a className={styles.email} href={`mailto:${block.text}`} key={j}><span>{block.text}</span><span className={styles.emailArrow}><Arrow diagonal/></span></a>:<p key={j}>{block.text}</p>;
    })}</div>:<Description value={JSON.stringify(section.content)}/>}
   </section>;
  })}
 </main>;
}
