import { useState, type ReactNode } from "react";
import { Phone, StageCopy } from "./ProductPreview";
import { ArrowLeft, ArrowRight, Camera, Compass, Heart, MapPin, MessageCircle, Mountain, Route, Users, Zap } from "lucide-react";
import { communities, people, posts, upcomingRides } from "./demo";
import road from "./assets/india-road.webp";
import motorcycle from "./assets/hero-motorcycle.webp";
import ghats from "./assets/hero-ghats.webp";
import classic from "./assets/classic-350.webp";
import riders from "./assets/closing-riders.webp";
import garage from "./assets/garage-bike.webp";

type Area = "posts" | "rides" | "groups" | "people";
const areas: { id: Area; label: string }[] = [{ id: "posts", label: "Posts" }, { id: "rides", label: "Upcoming Rides" }, { id: "groups", label: "Communities" }, { id: "people", label: "People" }];
const groupAssets = [riders, road, ghats, classic, garage, motorcycle];
const groupIcons = [Users, Compass, Mountain, Route, Zap, Camera];
const areaCopy: Record<Area, [string, string]> = {
  posts: ["Share rides, photos and stories from the road with riders who get it.", "Every ride has a story worth telling — and someone who wants to hear it."],
  rides: ["Discover upcoming group rides, see where they start and how far they go.", "Finding people to ride with shouldn't depend on who you already know."],
  groups: ["Join communities built around how you ride, from touring to photography.", "The right community turns ownership questions into shared knowledge."],
  people: ["Find riders near you with similar motorcycles and riding interests.", "Some of the best motorcycle memories begin with the people you meet along the way."],
};
export function CommunityPreview({ intro }: { intro: ReactNode }) {
  const [area, setArea] = useState<Area>("posts");
  const label = areas.find(a => a.id === area)?.label ?? "";
  return <div className="feature-stage">
    <StageCopy intro={intro} title={label} text={areaCopy[area][0]} why={areaCopy[area][1]} />
    <Phone title="Community"><CommunityContent area={area} setArea={setArea} /></Phone>
  </div>;
}
function CommunityContent({ area, setArea }: { area: Area; setArea: (a: Area) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [liked, setLiked] = useState<string[]>([]); const [commentPost, setCommentPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string[]>>({}); const [draft, setDraft] = useState("");
  const ride = upcomingRides.find(x => x.id === selected); const group = communities.find(x => x.id === selected); const person = people.find(x => x.id === selected);
  const back = (label: string) => <button type="button" className="text-btn" onClick={() => setSelected(null)}><ArrowLeft size={14} aria-hidden="true" />{label}</button>;
  return <>
    <div className="app-tabs community-tabs" role="tablist" aria-label="Community sections">{areas.map(a => <button type="button" role="tab" key={a.id} aria-selected={area===a.id} className={area===a.id ? "is-active" : ""} onClick={() => { setArea(a.id); setSelected(null); }}>{a.label}</button>)}</div>
    <div className="app-panel" role="tabpanel">
      {area==="posts" && posts.map((post,i) => <article className="post" key={post.id}>
        <header className="rider-header"><span className="rider-avatar">{post.author.split(" · ")[1]?.slice(0,1)}</span><div><strong>{post.author}</strong><small>{post.bike} · {post.place}</small></div></header>
        <img className="community-photo" src={i===0 ? motorcycle : ghats} alt={i===0 ? "Motorcycle parked on a mountain road" : "Rider climbing a winding ghat road"} loading="lazy" />
        <p>{post.text}</p><div className="post-actions">
          <button type="button" aria-label={`Like ${post.author}'s demo post`} aria-pressed={liked.includes(post.id)} className={liked.includes(post.id) ? "is-liked" : ""} onClick={() => setLiked(l => l.includes(post.id) ? l.filter(x=>x!==post.id) : [...l,post.id])}><Heart size={15} aria-hidden="true" />{liked.includes(post.id) ? "Liked" : "Like"}</button>
          <button type="button" aria-expanded={commentPost===post.id} onClick={() => { setCommentPost(commentPost===post.id ? null : post.id); setDraft(""); }}><MessageCircle size={15} aria-hidden="true" />Comments ({(comments[post.id] ?? []).length})</button>
        </div>
        {commentPost===post.id && <div className="comments">{(comments[post.id] ?? []).map((c,j) => <p key={j}>You (demo): {c}</p>)}<form className="inline-form" onSubmit={e => { e.preventDefault(); if (!draft.trim()) return; setComments(c => ({ ...c,[post.id]: [...(c[post.id]??[]),draft.trim()] })); setDraft(""); }}><label className="sr-only" htmlFor={`comment-${post.id}`}>Write a comment</label><input id={`comment-${post.id}`} required maxLength={300} placeholder="Write a comment" value={draft} onChange={e => setDraft(e.target.value)} /><button type="submit" className="mini-btn">Post</button></form></div>}
      </article>)}
      {area==="rides" && (ride ? <div className="detail-view">{back("All rides")}<img className="community-photo" src={ride.id==="nandi" ? road : ghats} alt="Winding motorcycle route" /><h4>{ride.title}</h4><dl className="facts"><div><dt>Destination</dt><dd>{ride.id==="nandi" ? "Nandi Hills, Karnataka" : "Tamhini Ghat, Maharashtra"}</dd></div><div><dt>Date</dt><dd>{ride.date}</dd></div><div><dt>Start</dt><dd>{ride.meet}</dd></div><div><dt>Distance</dt><dd>{ride.distance}</dd></div><div><dt>Ride type</dt><dd>{ride.id==="nandi" ? "Breakfast ride" : "Weekend ride"}</dd></div></dl><p className="body-sm">{ride.text}</p><p className="fine">Illustrative route idea, not a registered or scheduled event.</p></div> : <div className="community-grid">{upcomingRides.map((r,i) => <button type="button" className="community-card" key={r.id} onClick={() => setSelected(r.id)}><img className="community-photo" src={i===0 ? road : ghats} alt="Mountain road for an illustrative ride" loading="lazy" /><span className="community-card-body"><small>{i===0 ? "Breakfast ride" : "Weekend ride"} · Demo</small><strong>{r.title}</strong><span>{r.date}</span><span><MapPin size={12} aria-hidden="true" />{r.meet}</span><span>{r.distance}</span><b>View ride<ArrowRight size={13} aria-hidden="true" /></b></span></button>)}</div>)}
      {area==="groups" && (group ? <div className="detail-view">{back("All communities")}<img className="community-photo" src={groupAssets[communities.indexOf(group)] ?? riders} alt={`Motorcycle imagery for ${group.name}`} /><h4>{group.name}</h4><p className="body-sm">{group.about}</p><dl className="facts"><div><dt>Interest</dt><dd>{group.category}</dd></div><div><dt>Discussion</dt><dd>Ride plans, motorcycle stories and rider advice</dd></div></dl><p className="fine">Fictional demo community. No real membership or official brand affiliation.</p></div> : <div className="community-grid">{communities.map((c,i) => { const Icon=groupIcons[i] ?? Users; return <button type="button" className="community-card" key={c.id} onClick={() => setSelected(c.id)}><img className="community-photo" src={groupAssets[i] ?? riders} alt={`Motorcycle imagery for ${c.name}`} loading="lazy" /><span className="community-card-body"><small><Icon size={13} aria-hidden="true" />{c.category}</small><strong>{c.name}</strong><span>{c.about}</span><b>Explore community<ArrowRight size={13} aria-hidden="true" /></b></span></button>; })}</div>)}
      {area==="people" && (person ? <div className="detail-view">{back("All riders")}<div className="profile-banner"><span className="rider-avatar rider-avatar--large">{person.name.split(" · ")[1]?.slice(0,1)}</span><h4>{person.name}</h4><p>Fictional rider profile</p></div><dl className="facts"><div><dt>Motorcycle</dt><dd>{person.bike}</dd></div><div><dt>Location</dt><dd>{person.location}</dd></div><div><dt>Interests</dt><dd>{person.interests.join(", ")}</dd></div><div><dt>About</dt><dd>{person.bio}</dd></div></dl></div> : <div className="community-grid">{people.map(p => <button type="button" key={p.id} className="community-card rider-card" onClick={() => setSelected(p.id)}><span className="rider-avatar">{p.name.split(" · ")[1]?.slice(0,1)}</span><span className="community-card-body"><small>Fictional rider</small><strong>{p.name}</strong><span>{p.bike} · {p.location}</span><span>{p.interests.join(" · ")}</span><b>View profile<ArrowRight size={13} aria-hidden="true" /></b></span></button>)}</div>)}
      <p className="fine">Fictional riders, communities and ride ideas. Likes and comments stay on this page only.</p>
    </div>
  </>;
}
