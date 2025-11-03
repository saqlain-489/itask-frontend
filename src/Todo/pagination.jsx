

const Pagination = ({ PostperPage, totalPosts, setCurrentPage }) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / PostperPage); i++) {
        pages.push(i)
    }

    return (
        <div className='pagination'>
            {pages.map((page, index) => {
                return <button key={index}
                    onClick={() => setCurrentPage(page)}
                    className='btn   btn-primary mb-5 fw-bold'
                >{page}</button>
            })}

        </div>


    )
}

export default Pagination
