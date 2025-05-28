import { useState, useEffect } from 'react'
import { db } from './firebase/firebaseconfig'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import './App.css'

function App() {
  // Estados para el formulario y los estudiantes
  const [form, setForm] = useState({
    CedulaEs: '', NombresES: '', ApellidosEs: '', Direccion: '', TelefonoES: '',
    Course: '', Paralelo: '', NameLastRep: '', TelefonoRep: '', Parentesco: '', Cedularep: '',
  })
  const [students, setStudents] = useState([])
  const [editId, setEditId] = useState(null)

  // Cargar estudiantes al iniciar
  useEffect(() => {
    fetchStudents()
  }, [])

  // Leer estudiantes de Firestore
  async function fetchStudents() {
    const querySnapshot = await getDocs(collection(db, 'students'))
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setStudents(data)
  }

  // Manejar cambios en el formulario
  function handleChange(e) {
    setForm({ ...form, [e.target.id || e.target.name]: e.target.value })
  }

  // Guardar o actualizar estudiante
  async function handleSubmit(e) {
    e.preventDefault()
    if (editId) {
      await updateDoc(doc(db, 'students', editId), form)
      setEditId(null)
    } else {
      await addDoc(collection(db, 'students'), form)
    }
    setForm({ CedulaEs: '', NombresES: '', ApellidosEs: '', Direccion: '', TelefonoES: '', Course: '', Paralelo: '', NameLastRep: '', TelefonoRep: '', Parentesco: '', Cedularep: '' })
    fetchStudents()
  }

  // Eliminar estudiante
  async function handleDelete(id) {
    await deleteDoc(doc(db, 'students', id))
    fetchStudents()
  }

  // Editar estudiante
  function handleEdit(student) {
    setForm(student)
    setEditId(student.id)
  }

  // Agrupar estudiantes por curso y paralelo
  function filterByCourseParalelo(course, paralelo) {
    return students.filter(s => s.Course === course && s.Paralelo === paralelo)
  }

  return (
    <div className="main-grid">
      <form className="students-form" onSubmit={handleSubmit}>
        <h1>Data Students</h1>
        <div>
          <label>Cedula</label>
          <input type="number" id='CedulaEs' value={form.CedulaEs} onChange={handleChange} required placeholder='Ingresa la cedula del estudiante'/>
        </div>
        <div>
          <label>Nombres</label>
          <input type="text" id="NombresES" value={form.NombresES} onChange={handleChange} required/>
        </div>
        <div>
          <label>Apellidos</label>
          <input type="text" id="ApellidosEs" value={form.ApellidosEs} onChange={handleChange} required/>
        </div>
        <div>
          <label>Direccion</label>
          <input type="text" id="Direccion" value={form.Direccion} onChange={handleChange} required/>
        </div>
        <div>
          <label>Telefono</label>
          <input type="number" id="TelefonoES" value={form.TelefonoES} onChange={handleChange} required/>
        </div>
        <div>
          <label>Curso</label>
          <select id="Course" value={form.Course} onChange={handleChange} required>
            <option value="">Seleccione</option>
            <option value="Octavo">Octavo</option>
            <option value="Noveno">Noveno</option>
            <option value="Decimo">Decimo</option>
          </select>
        </div>
        <div>
          <label>Paralelo</label>
          <select id="Paralelo" value={form.Paralelo} onChange={handleChange} required>
            <option value="">Seleccione</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div>
          <label>Nombre y apellido representante</label>
          <input type="text" id="NameLastRep" value={form.NameLastRep} onChange={handleChange} required/>
        </div>
        <div>
          <label>Telefono representante</label>
          <input type="number" id="TelefonoRep" value={form.TelefonoRep} onChange={handleChange} required/>
        </div>
        <div>
          <label>Parentesco</label>
          <input type="text" id="Parentesco" value={form.Parentesco} onChange={handleChange} required/>
        </div>
        <div>
          <label>Cedula representante</label>
          <input type="number" id="Cedularep" value={form.Cedularep} onChange={handleChange} required/>
        </div>
        <div className="btns">
          <button type='submit'>{editId ? 'Actualizar' : 'Guardar'}</button>
          {editId && <button type='button' onClick={()=>{setEditId(null);setForm({ CedulaEs: '', NombresES: '', ApellidosEs: '', Direccion: '', TelefonoES: '', Course: '', Paralelo: '', NameLastRep: '', TelefonoRep: '', Parentesco: '', Cedularep: '' })}}>Cancelar</button>}
        </div>
      </form>
      <aside className="data-container">
        {['Octavo','Noveno','Decimo'].map(curso => (
          ['A','B'].map(paralelo => (
            <section key={curso+paralelo} className={`courseStudent ${curso}${paralelo}`}>
              <h3>{curso} {paralelo}</h3>
              {filterByCourseParalelo(curso, paralelo).map(student => (
                <div key={student.id} className="student-card">
                  <div><b>Cédula:</b> {student.CedulaEs}</div>
                  <div><b>Nombre:</b> {student.NombresES} {student.ApellidosEs}</div>
                  <div><b>Dirección:</b> {student.Direccion}</div>
                  <div><b>Teléfono:</b> {student.TelefonoES}</div>
                  <div><b>Representante:</b> {student.NameLastRep} ({student.Parentesco})</div>
                  <div><b>Tel. Rep:</b> {student.TelefonoRep}</div>
                  <div><b>Cédula Rep:</b> {student.Cedularep}</div>
                  <button onClick={()=>handleEdit(student)}>Editar</button>
                  <button onClick={()=>handleDelete(student.id)}>Eliminar</button>
                </div>
              ))}
            </section>
          ))
        ))}
      </aside>
    </div>
  )
}

export default App
