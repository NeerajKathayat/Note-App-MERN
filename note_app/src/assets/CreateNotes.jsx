import React, { useEffect, useState } from 'react'
import './CreateNotes.css'
const CreateNotes = ({setModal,notes,setNotes,currentNote,setCurrentNote,setNoteAlert,setNoteMessage,setAlertType}) => {

    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [tags, setTags] = useState('');
    const [tagList, setTagList] = useState([])
    const [isPinned,setIsPinned] = useState(false)
    

    useEffect(()=>{
        if(currentNote){
            setTitle(currentNote.title);
            setContent(currentNote.content)
            setTagList(currentNote.tags)
        }
    },[currentNote])
 

    const AddTags = () => {
        if (tags != '') {
            setTagList([...tagList,tags])
            console.log(tagList)
            setTags('')
        }
    }

    const closeModal=(e)=>{
        // e.stopPropagation();
        setModal(false)
        setCurrentNote(null)
    }

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };


    const HandleSubmit = async () =>{

        console.log(title,content)

        if(title && content){
          
        
        if(currentNote){
            console.log(currentNote._id)

            let updatedNote = await fetch(`https://note-backend-eight.vercel.app/edit-note/${currentNote._id}`,{
                method:'PUT',
                headers:{
                   'Content-Type':'application/json'
                },
                body : JSON.stringify({title,content,tagList,isPinned}),
                credentials: 'include' 
            })

            updatedNote = await updatedNote.json();

            if(!updatedNote.success)
            console.log(updatedNote)


            setNotes(notes.map((note)=>
                note._id === currentNote._id ? {...note, 
                    _id:updatedNote.note._id,
                    title:updatedNote.note.title,
                    content:updatedNote.note.content,
                    date:formatDate(updatedNote.note.updatedAt),
                    tags:updatedNote.note.tags,
                    isPinned:updatedNote.note.isPinned,
                    userId:updatedNote.note.userId,} : note
            ))

            notes.map(note=>{console.log(note)})
        }
        else{

            let newNote = await fetch("https://note-backend-eight.vercel.app/add-note",{
                method:'POST',
                headers:{
                   'Content-Type':'application/json'
                },
                body : JSON.stringify({title,content,tagList}),
                credentials: 'include' 
            })

            newNote = await newNote.json();

            if(newNote.success){
                console.log(newNote)
                setNotes([...notes,{
                    _id:newNote.note._id,
                    title:newNote.note.title,
                    content:newNote.note.content,
                    date:formatDate(newNote.note.updatedAt),
                    tags:newNote.note.tags,
                    isPinned:newNote.note.isPinned,
                    userId:newNote.note.userId,

                
                }])
            }
            else{
                console.log(newNote.message)
            }
            

        }

           if(currentNote){
              setNoteMessage('Note Updated Successfully')
           }
           else{
            setNoteMessage('Note Added Successfully')
           }

            setModal(false);

            setNoteAlert(true)
            setAlertType('success')

            setCurrentNote(null);

            setTimeout(() => {
                setNoteAlert(false)
            }, 3000);

            
         }

    }


    const handleDeleteTag=(index)=>{
        setTagList(tagList.filter((_,i)=> i != index));
    }

    return (
        <div className='overlay' onClick={closeModal}>
            <div className='Create-note' onClick={(e) => e.stopPropagation()} >
                <label>TITLE</label>
                <input className='title-inp' type="text" placeholder='Go To Gym At 5' value={title} onChange={(e)=>setTitle(e.target.value)} />
                <label>CONTENT</label>
                <textarea placeholder='Content' value={content} onChange={(e)=>setContent(e.target.value)} />
                <label>Tags</label>

                {tagList.length > 0 &&
                    <div className="TagContainer">
                        {tagList && tagList.map((element, index) => {
                            return (
                                <div className='HashTag' key={index}>
                                    <span>#</span>
                                    <span>{ element}</span>
                                    <span class="material-symbols-outlined" onClick={()=>handleDeleteTag(index)}>
                                        close
                                    </span>

                                </div>

                            )
                        })}

                    </div>}
                <div className='Tag-div'>
                    <input className='tag-inp' type="text" placeholder='Add tags' value={tags} onChange={(e) => { setTags(e.target.value) }} />
                    <div className='Tag-Add'>
                        <span class="material-symbols-outlined" onClick={AddTags}>add</span>
                    </div>
                </div>
                <button onClick={HandleSubmit}>
                    {currentNote ? 'Update' : 'Add'}
                </button>

                <span class="material-symbols-outlined close" onClick={closeModal}>
                    close
                </span>
            </div>
        </div>
    )
}

export default CreateNotes
