import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bell, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Edit3, Home, Menu, Plus, Sparkles, X } from 'lucide-react';
import './styles.css';

const children = {
  Alex: { grade: '4 класс', color: '#6778f5', soft: '#eef0ff', initial: 'A' },
  Anna: { grade: '9 класс', color: '#f26b8d', soft: '#fff0f4', initial: 'A' },
};

const seedEvents = [
  { id: 1, child: 'Alex', title: 'Математика', time: '08:30', end: '09:15', type: 'Урок', day: 'Пн', date: '2026-09-07', note: 'Кабинет 214' },
  { id: 2, child: 'Alex', title: 'Русский язык', time: '09:25', end: '10:10', type: 'Урок', day: 'Пн', date: '2026-09-07', note: 'Кабинет 108' },
  { id: 3, child: 'Anna', title: 'Физика', time: '10:20', end: '11:05', type: 'Урок', day: 'Пн', date: '2026-09-07', note: 'Кабинет 306' },
  { id: 4, child: 'Alex', title: 'Робототехника', time: '16:00', end: '17:15', type: 'Кружок', day: 'Пн', date: '2026-09-07', note: 'Центр «Квант»' },
  { id: 5, child: 'Anna', title: 'Подготовка к ОГЭ', time: '17:30', end: '19:00', type: 'Доп. занятие', day: 'Вт', date: '2026-09-08', note: 'Онлайн-занятие' },
  { id: 6, child: 'Anna', title: 'Волейбол', time: '18:00', end: '19:30', type: 'Кружок', day: 'Ср', date: '2026-09-09', note: 'Спортзал школы' },
  { id: 7, child: 'Alex', title: 'Английский язык', time: '15:30', end: '16:15', type: 'Доп. занятие', day: 'Чт', date: '2026-09-10', note: 'Онлайн-занятие' },
];
const seedTasks = [
  { id: 1, title: 'Собрать рюкзак на завтра', child: 'Alex', period: 'День', done: false },
  { id: 2, title: 'Прочитать две главы книги', child: 'Anna', period: 'Неделя', done: false },
  { id: 3, title: 'Выбрать книгу для семейного чтения', child: 'Alex', period: 'Месяц', done: true },
];
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];
const toDate = (value) => new Date(`${value}T12:00:00`);
const formatDate = (value) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(toDate(value));

function App() {
  const [activeTab, setActiveTab] = useState('Сегодня');
  const [selectedChild, setSelectedChild] = useState('Все');
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('family-events') || 'null') || seedEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 8, 1));
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('family-parent-tasks') || 'null') || seedTasks);
  const [taskPeriod, setTaskPeriod] = useState('День');

  useEffect(() => localStorage.setItem('family-events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('family-parent-tasks', JSON.stringify(tasks)), [tasks]);
  const visibleEvents = useMemo(() => events.filter(e => selectedChild === 'Все' || e.child === selectedChild), [events, selectedChild]);
  const todayEvents = visibleEvents.filter(e => e.day === 'Пн').sort((a,b) => a.time.localeCompare(b.time));
  const activities = visibleEvents.filter(e => e.type !== 'Урок');
  const openNew = () => { setEditing(null); setIsModalOpen(true); };
  const saveEvent = (event) => { setEvents(items => editing ? items.map(item => item.id === editing.id ? event : item) : [...items, event]); setIsModalOpen(false); };
  const editEvent = (event) => { setEditing(event); setIsModalOpen(true); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'show' : ''}`}>
      <div className="brand"><span className="brand-mark"><Home size={20}/></span><span>Семейный<br/><b>ритм</b></span><button className="close-menu" onClick={() => setMobileMenu(false)}><X /></button></div>
      <nav>{['Сегодня', 'Расписание', 'Кружки', 'Календарь', 'Задания от родителей'].map((label, i) => { const Icon = [Sparkles, BookOpen, Clock3, CalendarDays, Check][i]; return <button className={activeTab === label ? 'active' : ''} onClick={() => {setActiveTab(label); setMobileMenu(false); if(label === 'Задания от родителей') setTimeout(() => document.getElementById('parent-tasks')?.scrollIntoView({behavior:'smooth',block:'start'}), 0)}} key={label}><Icon size={19}/>{label}</button> })}</nav>
      <div className="sidebar-bottom"><p>Дети</p>{Object.entries(children).map(([name, kid]) => <div className="kid-row" key={name}><span className="avatar" style={{background:kid.color}}>{kid.initial}</span><span>{name}<small>{kid.grade}</small></span><i style={{background:kid.color}} /></div>)}</div>
    </aside>
    <main>
      <header><button className="menu-btn" onClick={() => setMobileMenu(true)}><Menu /></button><div><p className="eyebrow">Понедельник, 7 сентября</p><h1>{activeTab === 'Сегодня' ? 'Доброе утро!' : activeTab}</h1></div><div className="header-actions"><button className="bell" onClick={() => setNotice(!notice)}><Bell size={20}/>{notice && <span/>}</button><button className="add-btn" onClick={openNew}><Plus size={19}/>Добавить событие</button></div></header>
      <section className="filters"><span>Показать:</span>{['Все', ...Object.keys(children)].map(name => <button key={name} className={selectedChild===name ? 'selected' : ''} onClick={() => setSelectedChild(name)}>{name !== 'Все' && <i style={{background:children[name].color}}/>}{name}</button>)}</section>
      {activeTab === 'Календарь' ? <Calendar events={visibleEvents} date={calendarDate} setDate={setCalendarDate} edit={editEvent}/> : <>
        <section className="hero-grid"><div className="section-card daily"><div className="card-heading"><div><p className="eyebrow">ПЛАН НА СЕГОДНЯ</p><h2>Расписание</h2></div><button className="link-btn" onClick={() => setActiveTab('Расписание')}>Всё расписание <ChevronRight size={16}/></button></div><div className="timeline">{todayEvents.map(event => <EventCard event={event} key={event.id} onEdit={editEvent}/>)}</div></div>
        <div className="right-column"><div className="summary-card"><div className="sun">☀️</div><div><p>У вас всё под контролем</p><strong>{todayEvents.length} событий сегодня</strong></div></div><div className="section-card mini-calendar"><div className="card-heading"><h2>Сентябрь</h2><div><button><ChevronLeft size={17}/></button><button><ChevronRight size={17}/></button></div></div><MonthPreview events={visibleEvents}/></div></div></section>
        <section className="section-card activities"><div className="card-heading"><div><p className="eyebrow">ПОСЛЕ УРОКОВ</p><h2>{activeTab === 'Кружки' ? 'Кружки и занятия' : 'Ближайшие занятия'}</h2></div><button className="link-btn" onClick={() => setActiveTab('Кружки')}>Все занятия <ChevronRight size={16}/></button></div><div className="activity-grid">{activities.slice(0, activeTab === 'Кружки' ? activities.length : 3).map(event => <ActivityCard event={event} key={event.id} onEdit={editEvent}/>)}</div></section>
        <div id="parent-tasks"><ParentTasks tasks={tasks} period={taskPeriod} setPeriod={setTaskPeriod} setTasks={setTasks}/></div>
        {activeTab === 'Расписание' && <section className="section-card week-card"><h2>Недельное расписание</h2><div className="week-grid">{weekdays.map(day => <div key={day}><strong>{day}</strong>{visibleEvents.filter(e=>e.day===day).map(e=><button onClick={()=>editEvent(e)} className="week-event" style={{borderColor:children[e.child].color}} key={e.id}>{e.time}<br/>{e.title}<small>{e.child}</small></button>)}</div>)}</div></section>}
      </>}
      {notice && <div className="reminder"><Bell size={18}/><div><b>Напоминание</b><span>У Alex робототехника через 2 часа</span></div><button onClick={() => setNotice(false)}><X size={17}/></button></div>}
    </main>
    {isModalOpen && <EventModal editing={editing} onClose={() => setIsModalOpen(false)} onSave={saveEvent}/>} 
  </div>;
}

function EventCard({event, onEdit}) { const kid = children[event.child]; return <article className="event-row" style={{'--accent':kid.color, '--soft':kid.soft}}><time>{event.time}<small>{event.end}</small></time><span className="event-line"/><div><b>{event.title}</b><p>{event.note}</p></div><span className="tag">{event.child}</span><button aria-label="Редактировать" onClick={() => onEdit(event)}><Edit3 size={16}/></button></article> }
function ActivityCard({event, onEdit}) { const kid=children[event.child]; return <article className="activity-card" style={{'--accent':kid.color,'--soft':kid.soft}}><div className="activity-icon">{event.type === 'Кружок' ? '✦' : '◌'}</div><div><span>{event.day}, {event.time} · {event.child}</span><h3>{event.title}</h3><p>{event.note}</p></div><button onClick={()=>onEdit(event)}><Edit3 size={16}/></button></article> }
function ParentTasks({tasks,period,setPeriod,setTasks}) { const [adding,setAdding]=useState(false); const [draft,setDraft]=useState({title:'',child:'Alex'}); const shown=tasks.filter(t=>t.period===period); const toggle=(id)=>setTasks(items=>items.map(t=>t.id===id?{...t,done:!t.done}:t)); const add=(e)=>{e.preventDefault();if(!draft.title.trim())return;setTasks(items=>[...items,{id:Date.now(),title:draft.title.trim(),child:draft.child,period,done:false}]);setDraft({title:'',child:'Alex'});setAdding(false)}; return <section className="section-card parent-tasks"><div className="card-heading"><div><p className="eyebrow">ДОМАШНИЕ ДЕЛА</p><h2>Задания от родителей</h2></div><button className="link-btn" onClick={()=>setAdding(!adding)}><Plus size={16}/>Добавить</button></div><div className="period-tabs">{['День','Неделя','Месяц'].map(item=><button className={period===item?'selected':''} onClick={()=>setPeriod(item)} key={item}>{item}</button>)}</div>{adding&&<form className="task-form" onSubmit={add}><input autoFocus value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="Новое задание"/><select value={draft.child} onChange={e=>setDraft({...draft,child:e.target.value})}>{Object.keys(children).map(name=><option key={name}>{name}</option>)}</select><button className="task-add" aria-label="Добавить"><Plus size={18}/></button></form>}<div className="task-list">{shown.length?shown.map(task=><div className={`task-item ${task.done?'done':''}`} key={task.id}><button className="check" onClick={()=>toggle(task.id)} aria-label="Отметить выполненным">{task.done&&<Check size={14}/>}</button><span>{task.title}</span><small style={{color:children[task.child].color,background:children[task.child].soft}}>{task.child}</small></div>):<p className="empty-tasks">На этот период заданий пока нет.</p>}</div></section> }
function MonthPreview({events}) { const days=Array.from({length:30},(_,i)=>i+1); return <div className="month"><div className="weekdays">{['П','В','С','Ч','П','С','В'].map(x=><span key={x}>{x}</span>)}</div><div className="day-grid">{Array.from({length:1}).map((_,i)=><i key={i}/>)}{days.map(day=>{const matches=events.filter(e=>toDate(e.date).getDate()===day);return <button key={day} className={day===7?'today':''}>{day}{matches.slice(0,2).map(e=><em style={{background:children[e.child].color}} key={e.id}/>)}</button>})}</div></div> }
function Calendar({events,date,setDate,edit}) { const year=date.getFullYear(), month=date.getMonth(); const first=(new Date(year,month,1).getDay()+6)%7; const count=new Date(year,month+1,0).getDate(); const label=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(date); return <section className="section-card full-calendar"><div className="card-heading"><h2>{label}</h2><div><button onClick={()=>setDate(new Date(year,month-1,1))}><ChevronLeft size={18}/></button><button onClick={()=>setDate(new Date(year,month+1,1))}><ChevronRight size={18}/></button></div></div><div className="calendar-weekdays">{['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'].map(d=><span key={d}>{d}</span>)}</div><div className="calendar-days">{Array.from({length:first},(_,i)=><div key={'empty'+i}/>)}{Array.from({length:count},(_,i)=>{const day=i+1;const current=events.filter(e=>{const d=toDate(e.date);return d.getFullYear()===year&&d.getMonth()===month&&d.getDate()===day});return <div className="calendar-day" key={day}><b>{day}</b>{current.map(e=><button key={e.id} onClick={()=>edit(e)} style={{background:children[e.child].soft,color:children[e.child].color}}>{e.time} {e.title}</button>)}</div>})}</div></section> }
function EventModal({editing,onClose,onSave}) { const [form,setForm]=useState(editing || {child:'Alex',title:'',time:'16:00',end:'17:00',type:'Кружок',day:'Пн',date:'2026-09-07',note:''}); const change=(e)=>setForm({...form,[e.target.name]:e.target.value}); return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal" onMouseDown={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault();onSave({...form,id:editing?.id||Date.now()})}}><div className="card-heading"><h2>{editing?'Редактировать событие':'Новое событие'}</h2><button type="button" onClick={onClose}><X/></button></div><label>Название<input required name="title" value={form.title} onChange={change} placeholder="Например, занятие по английскому"/></label><div className="form-grid"><label>Ребёнок<select name="child" value={form.child} onChange={change}>{Object.keys(children).map(n=><option key={n}>{n}</option>)}</select></label><label>Тип<select name="type" value={form.type} onChange={change}>{['Урок','Кружок','Доп. занятие'].map(n=><option key={n}>{n}</option>)}</select></label><label>Дата<input type="date" name="date" value={form.date} onChange={change}/></label><label>День<select name="day" value={form.day} onChange={change}>{weekdays.map(n=><option key={n}>{n}</option>)}</select></label><label>Начало<input type="time" name="time" value={form.time} onChange={change}/></label><label>Окончание<input type="time" name="end" value={form.end} onChange={change}/></label></div><label>Детали<input name="note" value={form.note} onChange={change} placeholder="Место или ссылка"/></label><button className="save-btn">Сохранить событие</button></form></div> }
createRoot(document.getElementById('root')).render(<App/>);
