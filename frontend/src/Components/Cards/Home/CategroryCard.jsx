import React from 'react'

const CategoryCard = ({category}) => {
    return (
        <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
                <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-[300px] sm:h-64"
                />
                <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-3xl font-semibold text-center px-4">
                    {category.name}
                </h2>
            </div>
        </div>
    )
}

export default CategoryCard
