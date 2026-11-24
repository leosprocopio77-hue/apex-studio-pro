import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'apex_studio_pro_no_icons_v1';

const INITIAL_DATA = {
  studio: {
    name: 'Apex Studio Pro',
    slogan: 'Força, Performance & Preparação Física',
    coachName: 'Lucas Andrade',
    cref: 'CREF 048291-G/SP'
  },
  students: [
    { id: '1', name: 'Rafael Mendes', phone: '5511988887777', goal: 'Hipertrofia', level: 'Intermediário', freq: '4x/sem' },
    { id: '2', name: 'Camila Ferreira', phone: '5511977776666', goal: 'Condicionamento', level: 'Iniciante', freq: '3x/sem' },
    { id: '3', name: 'Bruno Vasconcelos', phone: '5511966665555', goal: 'Performance', level: 'Avançado', freq: '5x/sem' }
  ],
  workouts: {
    A: {
      title: 'Treino A — Peito, Ombros e Tríceps',
      exercises: [
        { id: 'e1', name: 'Supino Reto com Halteres', sets: '4', reps: '8-12', load: '24 kg', rest: '90s' },
        { id: 'e2', name: 'Desenvolvimento Ombros', sets: '3', reps: '10-12', load: '16 kg', rest: '75s' },
        { id: 'e3', name: 'Tríceps Pulley Corda', sets: '3', reps: '12-15', load: '25 kg', rest: '60s' }
      ]
    },
    B: {
      title: 'Treino B — Costas e Bíceps',
      exercises: [
        { id: 'e4', name: 'Puxada Alta Barra Reta', sets: '4', reps: '10-12', load: '55 kg', rest: '75s' },
        { id: 'e5', name: 'Remada Curvada Barra', sets: '4', reps: '8-10', load: '60 kg', rest: '90s' },
        { id: 'e6', name: 'Rosca Direta Polia', sets: '3', reps: '10-12', load: '28 kg', rest: '60s' }
      ]
    },
    C: {
      title: 'Treino C — Pernas e Core',
      exercises: [
        { id: 'e7', name: 'Agachamento Livre / Smith', sets: '4', reps: '8-10', load: '80 kg', rest: '120s' },
        { id: 'e8', name: 'Leg Press 45°', sets: '4', reps: '10-15', load: '180 kg', rest: '90s' },
        { id: 'e9', name: 'Prancha Isométrica', sets: '3', reps: '45s', load: 'Corpo', rest: '45s' }
      ]
    }
  },
  assessments: [
    { id: 'a1', student: 'Rafael Mendes', date: '2026-11-10', weight: '83.2 kg', fat: '13.6%', waist: '79 cm' },
    { id: 'a2', student: 'Camila Ferreira', date: '2026-10-20', weight: '67.5 kg', fat: '26.4%', waist: '74 cm' }
  ],
  schedule: [
    { id: 's1', time: '07:00', student: 'Rafael Mendes', type: 'Treino Presencial', status: 'Confirmado' },
    { id: 's2', time: '09:00', student: 'Camila Ferreira', type: 'Avaliação Física', status: 'Pendente' },
    { id: 's3', time: '16:30', student: 'Bruno Vasconcelos', type: 'Preparação Física', status: 'Presente' }
  ]
};

const EMPTY_STUDENT = {
  name: '',
  phone: '',
  goal: 'Hipertrofia',
  level: 'Intermediário',
  freq: '4x/sem'
};

const EMPTY_EXERCISE = {
  name: '',
  sets: '3',
  reps: '10-12',
  load: '20 kg',
  rest: '75s'
};

const EMPTY_EVAL = {
  student: INITIAL_DATA.students[0].name,
  date: '2026-11-23',
  weight: '',
  fat: '',
  waist: ''
};

const EMPTY_SLOT = {
  time: '18:00',
  student: INITIAL_DATA.students[0].name,
  type: 'Treino Presencial',
  status: 'Confirmado'
};

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(
    () => (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.students?.[0]?.id) || INITIAL_DATA.students[0].id
  );
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);

  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [exerciseForm, setExerciseForm] = useState(EMPTY_EXERCISE);

  const [editingEvalId, setEditingEvalId] = useState(null);
  const [evalForm, setEvalForm] = useState({
    ...EMPTY_EVAL,
    student: data.students[0]?.name || ''
  });

  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotForm, setSlotForm] = useState({
    ...EMPTY_SLOT,
    student: data.students[0]?.name || ''
  });

  const [brand, setBrand] = useState(data.studio);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  useEffect(() => {
    setBrand(data.studio);
  }, [data.studio]);

  useEffect(() => {
    if (data.students.length > 0 && !data.students.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(data.students[0].id);
    }
  }, [data.students, selectedStudentId]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          showToast('Tempo de descanso concluído!');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const currentStudent =
    data.students.find((s) => s.id === selectedStudentId) || data.students[0];
  const currentWorkout = data.workouts[selectedDivision];

  const openNewStudentModal = () => {
    setEditingStudentId(null);
    setStudentForm(EMPTY_STUDENT);
    setShowModal(true);
  };

  const openEditStudentModal = (student) => {
    setEditingStudentId(student.id);
    setStudentForm({
      name: student.name || '',
      phone: student.phone || '',
      goal: student.goal || 'Hipertrofia',
      level: student.level || 'Intermediário',
      freq: student.freq || '4x/sem'
    });
    setShowModal(true);
  };

  const closeStudentModal = () => {
    setShowModal(false);
    setEditingStudentId(null);
    setStudentForm(EMPTY_STUDENT);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    if (editingStudentId) {
      const previousStudent = data.students.find((s) => s.id === editingStudentId);
      setData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === editingStudentId ? { ...s, ...studentForm } : s
        ),
        assessments: previousStudent
          ? prev.assessments.map((a) =>
              a.student === previousStudent.name ? { ...a, student: studentForm.name } : a
            )
          : prev.assessments,
        schedule: previousStudent
          ? prev.schedule.map((item) =>
              item.student === previousStudent.name ? { ...item, student: studentForm.name } : item
            )
          : prev.schedule
      }));
      showToast('Aluno alterado!');
    } else {
      const created = { id: String(Date.now()), ...studentForm };
      setData((prev) => ({ ...prev, students: [created, ...prev.students] }));
      setSelectedStudentId(created.id);
      showToast('Aluno cadastrado!');
    }

    closeStudentModal();
  };

  const handleDeleteStudent = (student) => {
    const confirmed = window.confirm(`Deseja excluir o aluno "${student.name}"?`);
    if (!confirmed) return;

    setData((prev) => {
      const updatedStudents = prev.students.filter((s) => s.id !== student.id);
      if (selectedStudentId === student.id) {
        setSelectedStudentId(updatedStudents[0]?.id || '');
      }
      return {
        ...prev,
        students: updatedStudents
      };
    });
    showToast('Aluno excluído!');
  };

  const handleSaveExercise = (e) => {
    e.preventDefault();
    if (!exerciseForm.name.trim()) return;

    if (editingExerciseId) {
      setData((prev) => ({
        ...prev,
        workouts: {
          ...prev.workouts,
          [selectedDivision]: {
            ...prev.workouts[selectedDivision],
            exercises: prev.workouts[selectedDivision].exercises.map((ex) =>
              ex.id === editingExerciseId ? { ...ex, ...exerciseForm } : ex
            )
          }
        }
      }));
      setEditingExerciseId(null);
      setExerciseForm(EMPTY_EXERCISE);
      showToast('Exercício alterado!');
    } else {
      const item = { id: String(Date.now()), ...exerciseForm };
      setData((prev) => ({
        ...prev,
        workouts: {
          ...prev.workouts,
          [selectedDivision]: {
            ...prev.workouts[selectedDivision],
            exercises: [...prev.workouts[selectedDivision].exercises, item]
          }
        }
      }));
      setExerciseForm(EMPTY_EXERCISE);
      showToast('Exercício adicionado!');
    }
  };

  const startEditExercise = (ex) => {
    setEditingExerciseId(ex.id);
    setExerciseForm({
      name: ex.name || '',
      sets: ex.sets || '3',
      reps: ex.reps || '10-12',
      load: ex.load || '20 kg',
      rest: ex.rest || '75s'
    });
  };

  const cancelEditExercise = () => {
    setEditingExerciseId(null);
    setExerciseForm(EMPTY_EXERCISE);
  };

  const handleRemoveExercise = (exId) => {
    setData((prev) => ({
      ...prev,
      workouts: {
        ...prev.workouts,
        [selectedDivision]: {
          ...prev.workouts[selectedDivision],
          exercises: prev.workouts[selectedDivision].exercises.filter((x) => x.id !== exId)
        }
      }
    }));
    if (editingExerciseId === exId) {
      cancelEditExercise();
    }
    showToast('Exercício excluído!');
  };

  const whatsappText = [
    `*${data.studio.name.toUpperCase()}*`,
    `Aluno: ${currentStudent?.name || 'Aluno'}`,
    `${currentWorkout?.title || ''}`,
    '',
    ...(currentWorkout?.exercises || []).map(
      (ex, i) =>
        `${i + 1}. ${ex.name} — ${ex.sets}x ${ex.reps} | Carga: ${ex.load} | Desc: ${ex.rest}`
    ),
    '',
    `Bons treinos! — ${data.studio.coachName} (${data.studio.cref})`
  ].join('\n');

  const copyFicha = async () => {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      showToast('Ficha copiada para o WhatsApp!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copie o texto da caixa ao lado.');
    }
  };

  const openWhatsApp = () => {
    const phone = (currentStudent?.phone || '').replace(/\D/g, '');
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`
      : `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveEval = (e) => {
    e.preventDefault();
    if (!evalForm.weight.trim()) return;

    if (editingEvalId) {
      setData((prev) => ({
        ...prev,
        assessments: prev.assessments.map((a) =>
          a.id === editingEvalId ? { ...a, ...evalForm } : a
        )
      }));
      setEditingEvalId(null);
      setEvalForm({
        ...EMPTY_EVAL,
        student: data.students[0]?.name || ''
      });
      showToast('Avaliação alterada!');
    } else {
      setData((prev) => ({
        ...prev,
        assessments: [{ id: String(Date.now()), ...evalForm }, ...prev.assessments]
      }));
      setEvalForm((prev) => ({ ...prev, weight: '', fat: '', waist: '' }));
      showToast('Avaliação registrada!');
    }
  };

  const startEditEval = (item) => {
    setEditingEvalId(item.id);
    setEvalForm({
      student: item.student || '',
      date: item.date || '2026-11-23',
      weight: item.weight || '',
      fat: item.fat || '',
      waist: item.waist || ''
    });
  };

  const cancelEditEval = () => {
    setEditingEvalId(null);
    setEvalForm({
      ...EMPTY_EVAL,
      student: data.students[0]?.name || ''
    });
  };

  const handleDeleteEval = (id) => {
    setData((prev) => ({
      ...prev,
      assessments: prev.assessments.filter((a) => a.id !== id)
    }));
    if (editingEvalId === id) {
      cancelEditEval();
    }
    showToast('Avaliação excluída!');
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!slotForm.student.trim()) return;

    if (editingSlotId) {
      setData((prev) => ({
        ...prev,
        schedule: prev.schedule.map((s) =>
          s.id === editingSlotId ? { ...s, ...slotForm } : s
        )
      }));
      setEditingSlotId(null);
      setSlotForm({
        ...EMPTY_SLOT,
        student: data.students[0]?.name || ''
      });
      showToast('Horário alterado!');
    } else {
      setData((prev) => ({
        ...prev,
        schedule: [...prev.schedule, { id: String(Date.now()), ...slotForm }]
      }));
      showToast('Horário adicionado!');
    }
  };

  const startEditSlot = (slot) => {
    setEditingSlotId(slot.id);
    setSlotForm({
      time: slot.time || '18:00',
      student: slot.student || '',
      type: slot.type || 'Treino Presencial',
      status: slot.status || 'Confirmado'
    });
  };

  const cancelEditSlot = () => {
    setEditingSlotId(null);
    setSlotForm({
      ...EMPTY_SLOT,
      student: data.students[0]?.name || ''
    });
  };

  const handleDeleteSlot = (id) => {
    setData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== id)
    }));
    if (editingSlotId === id) {
      cancelEditSlot();
    }
    showToast('Horário excluído!');
  };

  const toggleSlotStatus = (id) => {
    const states = ['Pendente', 'Confirmado', 'Presente'];
    setData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s) =>
        s.id === id
          ? { ...s, status: states[(states.indexOf(s.status) + 1) % states.length] }
          : s
      )
    }));
  };

  const handleSaveBrand = (e) => {
    e.preventDefault();
    setData((prev) => ({ ...prev, studio: brand }));
    showToast('Identidade do estúdio salva!');
  };

  const filteredStudents = data.students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-orange-500/40 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs">
          {toast}
        </div>
      )}

      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col justify-between print:hidden">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
              AS
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm text-white truncate">{data.studio.name}</h1>
              <p className="text-[11px] text-slate-400 truncate">{data.studio.coachName}</p>
            </div>
          </div>

          <nav className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-1 gap-1.5 text-xs">
            {[
              { id: 'dashboard', label: 'Painel' },
              { id: 'students', label: 'Alunos' },
              { id: 'workouts', label: 'Fichas' },
              { id: 'assessments', label: 'Avaliações' },
              { id: 'schedule', label: 'Agenda' },
              { id: 'brand', label: 'Marca' }
            ].map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`px-3 py-2.5 rounded-xl font-medium transition text-left ${
                    active
                      ? 'bg-orange-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block text-[11px] text-slate-500 pt-4 border-t border-slate-800">
          {data.studio.cref}
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{data.studio.name}</h2>
                <p className="text-xs text-slate-400">{data.studio.slogan}</p>
              </div>
              <button
                onClick={openNewStudentModal}
                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-xl"
              >
                + Novo Aluno
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-semibold text-sm text-white">Buscar Aluno e Gerenciar</h3>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar aluno pelo nome..."
                  className="w-full sm:w-72 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                {filteredStudents.length === 0 ? (
                  <div className="text-xs text-slate-400 py-2">Nenhum aluno encontrado.</div>
                ) : (
                  filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{s.name}</span>
                        <span className="text-slate-400 ml-2">
                          • {s.goal} • {s.freq}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditStudentModal(s)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Alterar
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Alunos Ativos</div>
                <div className="text-2xl font-bold text-white mt-1">{data.students.length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Divisões de Treino</div>
                <div className="text-2xl font-bold text-white mt-1">3 (A / B / C)</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Avaliações</div>
                <div className="text-2xl font-bold text-white mt-1">{data.assessments.length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400">Agenda Hoje</div>
                <div className="text-2xl font-bold text-white mt-1">{data.schedule.length}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-white">Horários de Hoje</h3>
              {data.schedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-slate-800/70 last:border-0 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-orange-400 mr-3">{item.time}</span>
                    <span className="font-medium text-white">{item.student}</span>
                    <span className="text-slate-400 ml-2">• {item.type}</span>
                  </div>
                  <button
                    onClick={() => toggleSlotStatus(item.id)}
                    className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    {item.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'students' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">Alunos</h2>
              <button
                onClick={openNewStudentModal}
                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-xl"
              >
                + Cadastrar Aluno
              </button>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredStudents.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <div className="font-bold text-white text-sm">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.goal} • {s.freq}</div>
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    Nível: <strong>{s.level}</strong> • Tel: {s.phone || '—'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditStudentModal(s)}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                    >
                      Alterar
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(s)}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-xs font-medium text-rose-400"
                    >
                      Excluir
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      setTab('workouts');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white"
                  >
                    Abrir Ficha de Treino
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'workouts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {['A', 'B', 'C'].map((div) => (
                    <button
                      key={div}
                      onClick={() => {
                        setSelectedDivision(div);
                        cancelEditExercise();
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                        selectedDivision === div
                          ? 'bg-orange-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Treino {div}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {data.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      Aluno: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{currentWorkout?.title}</h3>
                  {editingExerciseId && (
                    <button
                      type="button"
                      onClick={cancelEditExercise}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar edição
                    </button>
                  )}
                </div>

                {currentWorkout?.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {idx + 1}. {ex.name}
                      </div>
                      <div className="text-slate-400">
                        {ex.sets}x {ex.reps} • Carga: {ex.load} • Descanso: {ex.rest}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEditExercise(ex)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(ex.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}

                <form onSubmit={handleSaveExercise} className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    <input
                      type="text"
                      value={exerciseForm.name}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                      placeholder="Exercício"
                      className="col-span-2 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      value={exerciseForm.sets}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                      placeholder="Séries"
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      value={exerciseForm.reps}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                      placeholder="Reps"
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      value={exerciseForm.load}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, load: e.target.value })}
                      placeholder="Carga"
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold rounded-xl px-3 py-2"
                    >
                      {editingExerciseId ? 'Salvar' : '+ Adicionar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Enviar no WhatsApp</h3>
                  <button
                    onClick={() => window.print()}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 print:hidden"
                  >
                    Imprimir
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={10}
                  value={whatsappText}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={copyFicha}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                  >
                    {copied ? 'Copiado!' : 'Copiar Texto'}
                  </button>
                  <button
                    onClick={openWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-semibold text-xs"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Cronômetro de Descanso</div>
                  <div className="font-mono font-bold text-lg text-white">{seconds}s</div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setRunning((r) => !r)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 text-xs font-semibold"
                  >
                    {running ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button
                    onClick={() => {
                      setRunning(false);
                      setSeconds(60);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs"
                  >
                    Zerar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'assessments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleSaveEval} className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  {editingEvalId ? 'Alterar Avaliação' : 'Nova Avaliação'}
                </h3>
                {editingEvalId && (
                  <button
                    type="button"
                    onClick={cancelEditEval}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                )}
              </div>
              <select
                value={evalForm.student}
                onChange={(e) => setEvalForm({ ...evalForm, student: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {data.students.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={evalForm.date}
                onChange={(e) => setEvalForm({ ...evalForm, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={evalForm.weight}
                onChange={(e) => setEvalForm({ ...evalForm, weight: e.target.value })}
                placeholder="Peso (ex: 78.5 kg)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={evalForm.fat}
                onChange={(e) => setEvalForm({ ...evalForm, fat: e.target.value })}
                placeholder="% Gordura (ex: 15%)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={evalForm.waist}
                onChange={(e) => setEvalForm({ ...evalForm, waist: e.target.value })}
                placeholder="Cintura (ex: 80 cm)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-orange-500 text-slate-950 font-semibold">
                {editingEvalId ? 'Salvar Alteração' : 'Salvar Avaliação'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {data.assessments.map((a) => (
                <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{a.student}</div>
                    <div className="text-slate-400">Data: {a.date}</div>
                    <div className="text-slate-200 pt-1">
                      Peso: <strong>{a.weight}</strong> • Gordura: <strong>{a.fat || '—'}</strong> • Cintura: <strong>{a.waist || '—'}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditEval(a)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEval(a.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleSaveSlot} className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  {editingSlotId ? 'Alterar Horário' : 'Novo Horário'}
                </h3>
                {editingSlotId && (
                  <button
                    type="button"
                    onClick={cancelEditSlot}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                )}
              </div>
              <input
                type="time"
                value={slotForm.time}
                onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={slotForm.student}
                onChange={(e) => setSlotForm({ ...slotForm, student: e.target.value })}
                placeholder="Nome do aluno"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={slotForm.type}
                onChange={(e) => setSlotForm({ ...slotForm, type: e.target.value })}
                placeholder="Serviço"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-orange-500 text-slate-950 font-semibold">
                {editingSlotId ? 'Salvar Alteração' : 'Adicionar'}
              </button>
            </form>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              {data.schedule.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-orange-400 mr-2">{s.time}</span>
                    <span className="font-semibold text-white">{s.student}</span>
                    <span className="text-slate-400 ml-2">• {s.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleSlotStatus(s.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200"
                    >
                      {s.status}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditSlot(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(s.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'brand' && (
          <form onSubmit={handleSaveBrand} className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Nome do Studio</h2>
            <div>
              <label className="text-slate-400 block mb-1">Nome do Estúdio</label>
              <input
                type="text"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Slogan</label>
              <input
                type="text"
                value={brand.slogan}
                onChange={(e) => setBrand({ ...brand, slogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Treinador / CREF</label>
              <input
                type="text"
                value={brand.coachName}
                onChange={(e) => setBrand({ ...brand, coachName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-semibold">
              Salvar Marca
            </button>
          </form>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                {editingStudentId ? 'Alterar Aluno' : 'Novo Aluno'}
              </h3>
              <button onClick={closeStudentModal} className="text-slate-400 hover:text-white">
                Fechar
              </button>
            </div>
            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                placeholder="Nome completo"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                placeholder="WhatsApp (ex: 5511999998888)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={studentForm.goal}
                onChange={(e) => setStudentForm({ ...studentForm, goal: e.target.value })}
                placeholder="Objetivo"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeStudentModal} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-semibold">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}