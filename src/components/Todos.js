import { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import  './Todos.css';

// const items = [
//     {id : 1, checked:false, item : 'html'},
//     {id : 2, checked:false, item : 'css'},
//     {id : 3, checked:false, item : 'javascript'},
//     {id : 4, checked:false, item : 'node'},
// ]
// axios 라이브러리 : 선호 

const Todos = () => {
    const [todo, setTodo] = useState(""); // 입력할 할일 테스트
    const [todos, setTodos] = useState([]);
    const [search, setSearch] = useState("");

    // const setSaveItems = listItems =>{
    //     setTodos(listItems);
    //     localStorage.setItem('todos', JSON.stringify( listItems ));
    // }

    //const url = 'http://localhost:3500/todos'
    const url = 'https://port-0-todos-backend-7xwyjq992llivdr0fu.sel4.cloudtype.app/todos'

    const AddItem = async (item)=>{
        const res = await fetch(url,{
            method: 'POST',
            body: JSON.stringify({ item }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            }})

        fetchHandle();
    }

    
    const fetchHandle = async () =>{
        const res = await fetch(url);
        const data = await res.json();
        setTodos(data);
    }

    useEffect(()=>{
        fetchHandle();
    },[])

    // 할일 목록, length = 0 
    const onSubmit = (event)=>{
        event.preventDefault(); 

        if( todo === "" ){
            return; 
        }
        AddItem(todo);
        setTodo('');
    }
    
    const onChange = (event)=>{
        setTodo(event.target.value);     // todo 초기화
    }

    const itemDelete = async (id)=>{ 
        // localhost:3500/todos/6
        await fetch(`${url}/${id}`, {
             method: 'DELETE',
        });

        fetchHandle();
        //const listItems = todos.filter( item => item.id !== id );
        //setSaveItems( listItems );
    }

    const checkHandle = async (id)=>{
        await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ id  }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        fetchHandle();
        // const listItems = todos.map( 
        //     item => item.id === id ? { ...item, checked : !item.checked } : item
        // )
        //setSaveItems( listItems );
    }

    return (
        <div className='todos-container'>
             <form  className='searchForm'
                    onSubmit={ e=> e.preventDefault() }>
                 <div>
                    <label htmlFor="search"> 검색어 입력 </label>
                    <input type="text"
                           id="search"
                           placeholder="search todos"
                           value={search}
                           onChange={ e=>setSearch(e.target.value)}
                    />
                 </div>
             </form>
             <form onSubmit={ onSubmit }
                    className="inputForm"
             >
                <div>
                    <label htmlFor="addItem">목록을 입력하세요.</label>
                    <input type="text" 
                        autoFocus
                        placeholder='목록을 입력하세요.'
                        onChange={ onChange }
                        value={todo}
                    />
                </div>
             </form>
             { todos.length ? (
                <ul className='todoList'>
                    {
                        // todo = {id : 4, checked:false, item : 'node'}
                        todos.map( todo => todo.item.includes(search) ? (
                            (
                                <li key={todo.id}>   
                                    <input type="checkbox"
                                        onChange={()=>{checkHandle(todo.id)}}
                                        id={todo.id}
                                        checked={todo.checked}
                                    />
                                    <label htmlFor={todo.id}
                                        style={{ fontSize:'24px',
                                                textDecoration : todo.checked ? "line-through" : "none"
                                            }} 
                                    >{todo.item}</label> 
                                    <MdDelete onClick={ ()=>{itemDelete(todo.id)}}
                                              className='deleteTodo'
                                    /> 
                                </li>
                            )
                        ):null)
                    }
                </ul>
             ): (
                <p style={{ color : 'red' }}> 목록을 찾을 수 없습니다. </p>
             )}
        </div> 
    )
}

export default Todos; 