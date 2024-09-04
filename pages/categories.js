/* eslint-disable react/jsx-key */
import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import { withSwal } from "react-sweetalert2";
import { ReactSortable } from "react-sortablejs";

function Categories({swal}){
    const [editedCategory,setEditedCategory]=useState (null);
    const [name,setName]=useState('');
    const[parentCategory,setParentCategory]= useState('');
    const [categories,setCategories] = useState([]);
    const [properties,setProperties]=useState([]);
    useEffect(()=> {
       fetchCategories();
    }, []);
    function fetchCategories(){
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
        })
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data= {
            name,
            parentCategory,
            properties:properties.map(p=>({
                name:p.name,
                values:p.values.split(',')
        }))}
        if (editedCategory){
            data._id=editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data);
        }
        
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name,values})=>({
            name,
            values:values.join(',')
        }          
        )));

    }
    function deleteCategory(category){
        Swal.fire({
            title: `Do you want to delete ${category.name}?`,
            showDenyButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: '#d55',
            denyButtonText: `No`,
            denyButtonColor: 'black'
            
          }).then(async result => {
            if (result.isConfirmed) {
                const {_id}=category;
                await axios.delete('/api/categories?_id='+_id)
                fetchCategories();
                Swal.fire({
                    title:"Deleted!",
                    confirmButtonColor:"black"});
                
            }
          });
    }
    function addProperty(){
        setProperties(prev=>{
            return [...prev, {name: '', values: []}]
        });
    }
    function handlePropertyChange(index,property,newName){
        setProperties(prev => {
            const properties=[...prev];
            properties[index].name=newName;
            return properties;
        })
    }
    function handlePropertyValuesChange(index,property,newValues){
        setProperties(prev => {
            const properties=[...prev];
            properties[index].values=newValues;
            return properties;
        })
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return[...prev].filter((p,pIndex)=>{
                return pIndex !== indexToRemove;
            });
        })
    }
    return(
        <Layout>
            <div className="bg-black rounded-lg border-2 border-black overflow-hidden p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-yellow-300">
                    {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new Category'}
                </h2>
                
                <form onSubmit={saveCategory} className="space-y-4">
                    <div className="flex gap-2">
                        <input 
                            className="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            type="text"
                            placeholder={'Category name'} 
                            onChange={ev => setName(ev.target.value)} 
                            value={name}
                        />
                        <select 
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            onChange={ev => setParentCategory(ev.target.value)}
                            value={parentCategory}
                        >
                            <option value="">No parent category</option>
                            {categories.length > 0 && categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-yellow-300 mb-2">Properties</label>
                        <button 
                            onClick={addProperty}
                            type="button"
                            className="btn-primary mb-4 bg-yellow-300 text-black hover:bg-yellow-300 transition-colors duration-200 flex items-center"
                        > 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Property
                        </button>
                        <ReactSortable list={properties} setList={setProperties} className="space-y-2">
                            {properties.length > 0 && properties.map((property, index) => (
                                <div key={index} className="flex gap-2 items-stretch">
                                    <input type="text"
                                        className="w-1/3 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        value={property.name}
                                        onChange={(ev) => handlePropertyChange(index, property, ev.target.value)}
                                        placeholder="Property name"/>
                                    <input type="text"
                                        className="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        onChange={(ev) => handlePropertyValuesChange(index, property, ev.target.value)}
                                        value={property.values}
                                        placeholder="Property values, comma separated"/>
                                    <button 
                                        type="button"
                                        className="px-3 mb-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                                        onClick={() => removeProperty(index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </ReactSortable>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary bg-yellow-400 text-black hover:bg-yellow-300 transition-colors duration-200">
                            Save
                        </button>
                        {editedCategory && (
                            <button  
                                type="button"
                                onClick={() => {
                                    setEditedCategory(null);
                                    setName('');
                                    setParentCategory('');
                                    setProperties([]);
                                }}
                                className="btn-primary text-black hover:bg-yellow-300 transition-colors duration-200"
                            >
                                Cancel
                            </button> 
                        )}
                    </div>
                </form>
            </div>
            {!editedCategory && (
                <div className="mt-4">
                    <h2 className="text-2xl font-bold mb-4 text-black">Categories</h2>
                    {categories.length > 0 && categories.map(category => (
                        <div key={category._id} className="bg-white p-4 rounded-lg shadow mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="font-semibold">{category.name}</span>
                                {category?.parent?.name && (
                                    <span className="text-sm text-gray-500 ml-2">
                                        (Parent: {category.parent.name})
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => editCategory(category)}
                                    className="btn-primary flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className="px-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 flex items-center justify-center font-semibold"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
        </Layout>
    )
}

export default withSwal(({swal},ref)=>(
    <Categories swal={swal}>
    
    </Categories>
));