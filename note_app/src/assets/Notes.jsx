import React, { useEffect, useState } from 'react'
import './Notes.css'
import NavBar from './NavBar'
import CreateNotes from './CreateNotes'
const Notes = () => {
    const [Modal, setModal] = useState(false)
    const [notes, setNotes] = useState([])
    const [currentNote, setCurrentNote] = useState(null)
    const [search, setSearch] = useState('');

    const [NoteAlert , setNoteAlert] = useState(false)
    const [NoteMessage , setNoteMessage] = useState('');
    const [AlertType,setAlertType] = useState('success')


    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchNotes = async()=>{
        let getNote = await fetch("http://localhost:4000/get-note",{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include'
        })

        getNote = await getNote.json();
        console.log(getNote)

        if(getNote.success){
            const updatedNotes = getNote.notes.map(note => ({
                _id: note._id,
                title: note.title,
                content: note.content,
                date: formatDate(note.updatedAt),
                tags: note.tags,
                isPinned: note.isPinned,
                userId:note.userId
            }));

            setNotes(updatedNotes);
            
        }
        else{
            console.log("error getting data")
        }
        }


    useEffect(()=>{

        fetchNotes();

    },[])

    const showModal = (note) => {
        setCurrentNote(note)
        setModal(true)
    }




    const handleDelete = async (note) => {
        let deleteNote = await fetch(`http://localhost:4000/delete-note/${note._id}`,{
            method:'DELETE',
                headers:{
                   'Content-Type':'application/json'
                },
                credentials: 'include' 
        })

        deleteNote = await deleteNote.json();

        if(deleteNote.success){
            setNotes(notes.filter((ele) => ele._id != note._id))
  
      
            setNoteMessage("Note Deleted Successfully")
            
            setAlertType('error')
    
            setNoteAlert(true);
    
            setTimeout(() => {
                setNoteAlert(false)
            }, 3000);
        }
        else{
            console.log("not deleted")
        }
    
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );


    const handlePinned = async (note)=>{
          let pinned = !note.isPinned;
          console.log("pinned" + pinned)
          let result = await fetch(`http://localhost:4000/updated-note-pinned/${note._id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
             },
             body: JSON.stringify({pinned}),
             credentials: 'include' 

          })

          result = await result.json()

      
            console.log(result.message)


            fetchNotes();

            setNoteMessage("Note Updated Successfully");
            setAlertType('success');
            setNoteAlert(true);

            setTimeout(() => {
                setNoteAlert(false);
            }, 3000);
          
    }

    return (
        <>
            <NavBar setSearch={setSearch} />
            <div className='Container-Div'>

                {filteredNotes.length > 0  ?   
                    filteredNotes.map((note, index) => {
                    return <div className='Container-Note' key={index}>
                        <p>{note.title}</p>
                        <p>{note.date}</p>
                        <p>{note.content}</p>
                        <div>
                            <p>
                                {
                                    note.tags.map((tag, tagIndex) => {
                                        return <span key={tagIndex} className='tag'>#{tag}</span>
                                    })
                                }
                            </p>

                            <div>
                                <span className="material-symbols-outlined" onClick={() => showModal(note)}>edit</span>
                                <span className="material-symbols-outlined" onClick={() => handleDelete(note)}>delete</span>
                            </div>

                            <i class={note.isPinned ? "fa fa-thumb-tack pinned active" : "fa fa-thumb-tack pinned"} aria-hidden="true"  onClick={()=>handlePinned(note)}></i>
                        </div>
                    </div>
                })

                :   

                <div className='NoNote'>No Notes Found</div>

            
            }

                {Modal && <CreateNotes setModal={setModal} notes={notes} setNotes={setNotes} currentNote={currentNote} setCurrentNote={setCurrentNote} setNoteAlert={setNoteAlert}
                setNoteMessage={setNoteMessage} setAlertType={setAlertType}/>}


                <div className='CreateNote-Button'>
                    <span className="material-symbols-outlined" onClick={() => setModal(true)} >add</span>
                </div>

                <div className={NoteAlert ? `Toast-${AlertType} active` : `Toast-${AlertType}`}>
                    <i className={AlertType === 'success' ? "fa fa-check-circle" : "fa fa-trash"} aria-hidden="true"></i>
                    <div>
                        {NoteMessage}
                    </div>
                </div>


            </div>
        </>

    )
}

export default Notes
 