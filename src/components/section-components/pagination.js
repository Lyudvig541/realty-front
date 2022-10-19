import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = (props) => {
    let data2 =props.data2;
    const getPage = props.getPage;
    const count = props.count ? props.count : 6;
    const style = props.styles ? "" : "pd-top-50";
    const handlePageClick = ({ selected: selectedPage }) => {
        getPage(++selectedPage)
    }
        return <div className={`pagination-content ${style}`}>
                <ReactPaginate
                    pageCount={data2.total/count}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={2}
                    previousLabel={"<"}
                    nextLabel={">"}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination_link"}
                    nextLinkClassName={"pagination_link"}
                    disabledClassName={"pagination_link--disabled"}
                    activeClassName={"pagination_link_active"}
                />
        </div>
}

export default Pagination
