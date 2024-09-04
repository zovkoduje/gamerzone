/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties

}){
const [title,setTitle]=useState(existingTitle || '');
const [description,setDescription] = useState(existingDescription || '');
const [price,setPrice]=useState(existingPrice || '');
const [images, setImages]=useState(existingImages || []);
const [goToProducts, setGoToProducts] = useState(false);
const [isUploading, setIsUploading] = useState(false);
const [categories,setCategories]=useState([])
const [category,setCategory]=useState(assignedCategory || '');
const [productProperties, setProductProperties]=useState(assignedProperties || {});
const router = useRouter();
useEffect(()=> {
    axios.get('/api/categories').then(result => {
        setCategories(result.data);
    })
}, [])

async function saveProduct(ev){
    ev.preventDefault();
    const data={title,description,price,images,category,properties:productProperties};
    if (_id){
        await axios.put('/api/products', {...data,_id});
        

    } else{
        await axios.post('/api/products', data);
    }
    setGoToProducts(true);
    
}
if (goToProducts){
    router.push('/products')
}
async function uploadImages(ev){
    const files= ev.target?.files;
    if (files?.length > 0){
        setIsUploading(true);
        const data = new FormData();
        for (const file of files){
            data.append('file', file);
        }
        const res= await axios.post('/api/upload',data);
        setImages(oldImages =>{
            return [...oldImages, ...res.data.links];
        })
        setIsUploading(false);
        
    }
}
function updateImagesOrder(images){
    setImages(images);
}
function setProdcutProp(propName,value){
    setProductProperties(prev=>{
        const newProductProps={...prev};
        newProductProps[propName]=value;
        return newProductProps;
    })
}
const propertiesToFill = [];
if (categories.length>0 && category){
    let catInfo=categories.find(({_id}) => _id === category)
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id){
        const parentCat=categories.find(({_id}) => _id === catInfo?.parent?._id);
        propertiesToFill.push(...parentCat.properties);
        catInfo=parentCat;

}}

return (
    <form onSubmit={saveProduct}>
      <div className="flex flex-col gap-2">
        <label>Product name</label>
        <input
          type="text"
          placeholder="Product name"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1"
        />
        
        <label>Category</label>
        <select
          value={category}
          onChange={ev => setCategory(ev.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="">Uncategorized</option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="flex flex-col gap-1">
            <label>{p.name}</label>
            <select
              value={productProperties[p.name]}
              onChange={ev => setProdcutProp(p.name, ev.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              {p.values.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
        
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
            {!!images?.length && images.map(link => (
              <div key={link} className="h-24 bg-white p-2 shadow-sm rounded-md border border-gray-200">
                <img src={link} alt="Product" className="h-full object-contain rounded-md" />
              </div>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 bg-yellow-300 flex items-center justify-center rounded-md p-2">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 bg-yellow-200 flex flex-col items-center justify-center text-sm gap-1 text-gray-800 rounded-md cursor-pointer hover:bg-yellow-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload
            <input type="file" onChange={uploadImages} className="hidden" />
          </label>
        </div>
        
        <label>Description</label>
        <textarea
          placeholder="Information about product"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1"
        />
        
        <label>Price (EUR)</label>
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1"
        />
        
        <button type="submit" className="btn-primary bg-yellow-300 text-black hover:bg-yellow-300">Save</button>
      </div>
    </form>
    
)
}