// TODO: ganti period & text sesuai pengalaman asli
const items = [
  {
    period: '20XX',
    school: 'SMP Persada Bakti Bekasi',
    role: 'IT Mentor',
    text: 'Mentored students in programming and software development fundamentals.',
    current: false,
  },
  {
    period: '20XX',
    school: 'SMA Negeri 9 Bekasi',
    role: 'IT Mentor',
    text: 'Mentored students in programming and software development fundamentals.',
    current: false,
  },
  {
    period: '20XX',
    school: 'SMA Rejis Bekasi',
    role: 'IT Mentor',
    text: 'Mentored students in programming and software development fundamentals.',
    current: false,
  },
]

export default function Mentoring() {
  return (
    <div className="exp-wrap" id="mentoring">
      <section className="exp" aria-label="Mentoring experience">
        <h2 className="exp__title">Mentoring</h2>
        <ol className="exp__list">
          {items.map((it) => (
            <li className="exp__row" key={it.school}>
              <p className="exp__period">
                {it.current && <i className="exp__dot" aria-hidden="true" />}
                {it.period}
              </p>
              <div>
                <h3 className="exp__school">{it.school}</h3>
                <p className="exp__role">{it.role}</p>
                <p className="exp__text">{it.text}</p>
              </div>
              <span className="exp__chip">Bekasi</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}