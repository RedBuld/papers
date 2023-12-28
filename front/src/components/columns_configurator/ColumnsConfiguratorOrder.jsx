import React from 'react'
import { DndContext,  closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, useSortable, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

function ColumnsConfiguratorOrder(props)
{
    const {
        columns,
        columnsActive,
        columnsOrder, setColumnsOrder, resetColumnsOrder
    } = props

    const toggleColumnsOrder = (event) => {
        let order = columnsOrder
        const {active, over} = event
        
        if( active.id !== over.id )
        {
            const oldIndex = order.indexOf(active.id)
            const newIndex = order.indexOf(over.id)
            let new_order = arrayMove(order, oldIndex, newIndex)
            setColumnsOrder( () => [...new_order] )
        }
    }

    const sortingSendors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (
        <>
            <div className="flex w-full justify-center px-2 py-2 cursor-pointer" onClick={resetColumnsOrder}>
                <span className="text-sm font-medium text-indigo-500 hover:text-indigo-900">Сбросить порядок</span>
            </div>
            <DndContext
                sensors={sortingSendors}
                collisionDetection={closestCenter}
                onDragEnd={toggleColumnsOrder}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext 
                    items={columnsOrder}
                    strategy={verticalListSortingStrategy}
                    >
                    { columnsOrder.map( (column_key) => { return (columnsActive.indexOf(column_key) > -1) && (
                        <SortableColumn key={column_key} id={column_key} label={columns[column_key].label}/>
                    ) })}
                </SortableContext>
            </DndContext>
        </>
    )
}

function SortableColumn(props)
{
    const {
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
        setNodeRef
    } = useSortable({id: props.id})
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <li className={ "flex flex-col border-2 border-dashed "+ ( isDragging ? " border-blue-600 cursor-move" : " border-slate-300 cursor-pointer" ) } ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div className="flex items-center p-2">
                <span className="ml-2 text-sm font-medium text-left text-gray-500 hover:text-gray-500">{props.label}</span>
            </div>
        </li>
    );
}

export default ColumnsConfiguratorOrder