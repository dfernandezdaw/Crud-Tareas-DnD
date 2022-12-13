import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

const App = () => {
  const tareasInitialState = JSON.parse(localStorage.getItem('tareas')) || []
  const tareaInitialState = {
    nombre: '',
    descripcion: '',
    estado: false,
    prioridad: false,
  }
  const [tareas, setTareas] = useState(tareasInitialState)
  const [tarea, setTarea] = useState(tareaInitialState)
  const [modoEdicion, setModoEdicion] = useState(false) // Modo edición por defecto false
  const [id, setId] = useState('') // Id por defecto vacío

  // Funciones
  const agregarTarea = e => {
    e.preventDefault()
    if (!tarea.nombre.trim()) {
      e.target[0].focus()
      Swal.fire({
        title: 'Error',
        text: 'El campo nombre es obligatorio',
        icon: 'error',
      })
      return
    }
    if (!tarea.descripcion.trim()) {
      e.target[1].focus()
      Swal.fire({
        title: 'Error',
        text: 'El campo descripción es obligatorio',
        icon: 'error',
      })
      return
    }
    Swal.fire({
      title: 'Éxito',
      text: 'Tarea agregada con éxito',
      icon: 'success',
    })
    setTareas([...tareas, tarea])
    setTarea(tareaInitialState)
  }

  const eliminarTarea = id => {
    setTareas(tareas.filter(item => item.id !== id))
  }

  const finalizarTarea = id => {
    setTareas(
      tareas.map(item =>
        item.id === id ? { ...item, estado: !item.estado } : item
      )
    )
  }

  const activarModoEdicion = item => {
    setModoEdicion(true) // Activamos el modo edición
    setTarea(item) // Guardamos la tarea a editar
    setId(item.id) // Guardamos el id de la tarea a editar
    // console.log('Modo edición activado')
  }

  const editarTarea = e => {
    e.preventDefault()
    if (!tarea.nombre.trim()) {
      e.target[0].focus()
      Swal.fire({
        title: 'Error',
        text: 'El campo nombre es obligatorio',
        icon: 'error',
      })
      return
    }
    if (!tarea.descripcion.trim()) {
      e.target[1].focus()
      Swal.fire({
        title: 'Error',
        text: 'El campo descripción es obligatorio',
        icon: 'error',
      })
      return
    }
    Swal.fire({
      title: 'Éxito',
      text: 'Tarea editada con éxito',
      icon: 'success',
    })
    const arrayEditado = tareas.map(item =>
      item.id === id
        ? {
            id: id,
            nombre: tarea.nombre,
            descripcion: tarea.descripcion,
            estado: tarea.estado,
            prioridad: tarea.prioridad,
          }
        : item
    )
    setTareas(arrayEditado)
    setModoEdicion(false)
    setTarea(tareaInitialState)
  }

  const handleChange = e => {
    setTarea({
      ...tarea,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      id: Date.now(),
    })
  }

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
  }, [tareas])

  const handleonDragEnd = result => {
    const { source, destination } = result
    if (!destination) return
    const items = [...tareas] // make a copy of todos
    const [reorderedItem] = items.splice(source.index, 1) // remove 1 item at source.index
    items.splice(destination.index, 0, reorderedItem) // insert reorderedItem at destination.index
    setTareas(items)
  }

  return (
    <DragDropContext onDragEnd={handleonDragEnd}>
      <div className='container mt-4'>
        <h1 className='text-center'>Tareas App</h1>
        <hr />
        <div className='row mt-2'>
          <div className='col-8'>
            <h4 className='text-center'>Lista tareas</h4>
            <Droppable droppableId='droppable-1'>
              {provided => (
                <ul
                  className='class="list-group'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tareas.map((item, index) => (
                    <Draggable
                      draggableId={`${item.id}`}
                      key={item.id}
                      index={index}
                    >
                      {provided => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={index}
                          className='list-group-item d-flex justify-content-between'
                        >
                          <div
                            className={
                              item.estado ? 'text-decoration-line-through' : ''
                            }
                          >
                            <div
                              className={
                                item.prioridad
                                  ? 'fw-bold  d-flex align-items-start text-danger'
                                  : 'fw-bold  d-flex align-items-start'
                              }
                            >
                              {item.nombre}
                            </div>
                            <p>{item.descripcion}</p>
                          </div>
                          <div className='d-flex justify-content-end align-items-center'>
                            <button
                              type='button'
                              className='btn btn-secondary me-2 btn-sm float-end'
                              onClick={() => finalizarTarea(item.id)}
                            >
                              {item.estado ? 'Activar' : 'Finalizar'}
                            </button>
                            <button
                              className='btn btn-warning me-2 btn-sm float-end'
                              onClick={() => activarModoEdicion(item)}
                            >
                              Editar
                            </button>
                            <button
                              className='btn btn-danger me-2 btn-sm float-end'
                              onClick={e => eliminarTarea(item.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <div className='col-4'>
            <h4 className='text-center'>
              {modoEdicion ? 'Editar tarea' : 'Agregar tareas'}
            </h4>
            <form onSubmit={modoEdicion ? editarTarea : agregarTarea}>
              <input
                name='nombre'
                type='text'
                className='form-control mb-2'
                placeholder='Introduce el nombre de la tarea'
                onChange={e => handleChange(e)}
                value={tarea.nombre}
              />
              <textarea
                name='descripcion'
                type='text'
                className='form-control mb-2'
                placeholder='Introduce la descripción de la tarea'
                onChange={e => handleChange(e)}
                value={tarea.descripcion}
              />
              {/* <select
              name='estado'
              className='form-control mb-2'
              onChange={e => handleChange(e)}
              value={tarea.estado}
            >
              <option value='pendiente'>Pendiente</option>
              <option value='completada'>Completada</option>
            </select> */}

              <div className='form-check mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='prioridad'
                  checked={tarea.prioridad}
                  onChange={e => handleChange(e)}
                />
                <label className='form-check-label' htmlFor='flexCheckDefault'>
                  Prioridad
                </label>
              </div>
              {/* Cambiar el botón a amarillo y con el texto Editar si el modo edición es true */}
              {modoEdicion ? (
                <button className='btn btn-warning w-100 mt-2'>Editar</button>
              ) : (
                <button className='btn btn-dark w-100 mt-2'>Agregar</button>
              )}
              {/* <button className='btn btn-dark w-100 mt-2'>
               {modoEdicion ? 'Editar' : 'Agregar'}
            </button> */}
            </form>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

export default App
