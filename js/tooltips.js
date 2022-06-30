tippy.setDefaultProps({
    delay: 50,
    duration: [500, 100],
    placement: 'right',
});

tippy('#inbox-list', {
    content: 'Lista principal de las tareas'
})

tippy('#all-tasks-list', {
    content: 'Todas las tareas'
});

tippy('#today-list', {
    content: 'Tareas programadas para el día de hoy'
});

tippy('#tags-list', {
    content: 'Tareas clasificadas por etiquetas'
})

tippy('#complete-tasks-list', {
    content: 'Tareas marcadas como completas'
})

