import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import Rating from 'react-rating-stars-component'
import CustomToastContainer from './Toast/CustomToastContainer'
import {toast} from 'react-toastify'

function ShowInfo() {
    const [feedback, setFeedback] = useState(null)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const {id} = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const ratingChanged = (newRating) => {
        setRating(newRating)
    }

    const addCart = async (id) => {
        try {
            await axios.get(
                `http://localhost:3000/api/product/addToCart/${id}`,
                {withCredentials: true},
            )
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error('Please Login')
            }
        }
    }

    const handleFeedback = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                'http://localhost:3000/api/feedback/createFeedback',
                {
                    productId: id,
                    rating: rating,
                    comment: comment,
                },
                {withCredentials: true},
            )
        } catch (err) {
            console.error('Error submitting feedback:', err)
            if (err.response && err.response.status === 401) {
                toast.error('Please Login')
            }
        }
    }

    const fetchFeedback = async (id) => {
        const response = await axios.get(
            `http://localhost:3000/api/feedback/fetchFeedback/${id}`,
            {withCredentials: true},
        )
        setFeedback(response.data.data)
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/product/showProduct/${id}`,
                    null,
                    {withCredentials: true},
                )
                setProduct(response.data.product)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching product details:', error)
            }
        }
        fetchFeedback(id)
        fetchProduct()
    }, [id, feedback])

    return (
        <div className="container mx-auto px-4 py-8">
            <CustomToastContainer />
            {loading ? (
                <p>Loading...</p>
            ) : product ? (
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:mr-12  md:mb-0">
                        <div className="mb-6 h-1/2 bg-blue-500">
                            <img
                                src={product.coverImage}
                                alt={product.productName}
                                className="w-64 h-auto mb-4"
                            />
                        </div>
                        <h2 className="text-xl font-semibold">
                            {product.productName}
                        </h2>
                    </div>
                    <div className="flex-1 self-start">
                        <p className="text-lg mb-4">{product.category}</p>
                        <p className="text-lg mb-4">{product.description}</p>
                        <p className="text-lg mb-4">{product.price}</p>
                        <div className="flex flex-col ">
                            <button
                                onClick={() => {
                                    addCart(product._id)
                                }}
                                className="bg-blue-500 w-36 text-white px-4 py-2 my-1 rounded hover:bg-blue-600"
                            >
                                Add to Cart
                            </button>
                            <button className="bg-blue-500 w-40 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No product found with ID: {id}</p>
            )}
            <h1>Rate this</h1>
            <form className="flex flex-col" onSubmit={handleFeedback}>
                <div className="mb-4">
                    <Rating
                        name="rating"
                        count={5}
                        onChange={ratingChanged}
                        size={35}
                        activeColor="#ffd700"
                        required
                    />
                </div>
                <textarea
                    onChange={(e) => {
                        setComment(e.target.value)
                    }}
                    name="comment"
                    id="comment"
                    cols="30"
                    value={comment}
                    required
                    rows="10"
                    className="border-black resize-none w-1/4 mb-4 p-2"
                    placeholder="Enter your comment here..."
                />
                <button className="bg-blue-500 w-40 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Submit
                </button>
            </form>
            <h1>Feedback</h1>
            <div>
                {feedback !== null ? (
                    feedback.map((feedbackItem) => (
                        <div
                            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                            key={feedbackItem._id}
                        >
                            <p className="font-bold text-xl mb-2">
                                {feedbackItem.userId.username}
                            </p>
                            <Rating
                                value={feedbackItem.rating}
                                count={5}
                                size={24}
                                activeColor="#ffd700"
                                edit={false}
                            />
                            <p className="text-gray-700 text-base">
                                {feedbackItem.comment}
                            </p>
                            <div className="flex items-center">
                                <p className="text-blue-500 text-base">
                                    Reviewd on :{' '}
                                    {new Date(
                                        feedbackItem.createdAt,
                                    ).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading feedback...</p>
                )}
            </div>
        </div>
    )
}

export default ShowInfo
