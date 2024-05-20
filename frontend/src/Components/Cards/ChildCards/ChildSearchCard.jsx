import React from 'react'
import Rating from 'react-rating-stars-component'
import {FaCartPlus, FaHeart, FaShare} from 'react-icons/fa'
import {IoMdShareAlt} from 'react-icons/io'
import axios from 'axios'
import {toast} from 'react-toastify'
import {IoCartOutline} from 'react-icons/io5'

export default function ChildCard({item, showProduct}) {
    const addToCart = async (productId) => {
        try {
            const response = await axios.get(
                `/api/product/addToCart/${productId}`,
                {withCredentials: true},
            )
            if (response.status === 200) {
                toast.success(response.data.message)
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error('Please Login')
            }
        }
    }
    const handleShare = async (item) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: item.productName,
                    text: item.description,
                    url: `/showProduct/${item._id}`,
                })
            } else {
                throw new Error('Web Share API not supported')
            }
        } catch (error) {
            console.error('Error sharing:', error)
            toast.error('Error sharing product')
        }
    }

    return (
        <div
            onClick={() => showProduct(item._id)}
            key={item._id}
            className="border rounded-lg overflow-hidden cursor-pointer relative group transition duration-300 transform hover:scale-105"
        >
            <img
                src={item.images[0]}
                alt={item.productName}
                className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0  opacity-0 group-hover:opacity-60 transition-opacity"></div>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    addToCart(item._id)
                }}
                className="absolute bottom-4 right-4 bg-[#e6e6ee2d] text-[black] px-3 py-2 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-[white] text-xl transition duration-300 opacity-0 group-hover:opacity-100"
            >
                <IoCartOutline />
            </button>
            <button
                className="absolute top-4 right-4 bg-[#e6e6ee2d] text-[white] px-3 py-2 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-[white] text-xl transition duration-300 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation()
                    handleShare(item)
                }}
            >
                <IoMdShareAlt />
            </button>
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-[15px] font-[600] mb-2">
                    {item.productName}
                </h2>
                <p className="text-gray-700">₹{item.price}</p>
                <Rating
                    value={item.rating}
                    count={5}
                    size={25}
                    activeColor="orange"
                    edit={false}
                    isHalf={true}
                />
            </div>
        </div>
    )
}
