// // src/components/SearchForm.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// function SearchForm({ searchTerm, setSearchTerm }) {
//     const navigate = useNavigate();

//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (searchTerm.trim()) {
//             navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
//         } if (!searchTerm.trim()) {
//             navigate("/menu"); // กลับไปแสดงเมนูทั้งหมด
//         }

//     };

//     return (
    
//         <div className="menu-search-group">
//             <form className="nav-search-form" onSubmit={handleSearch}>
//                 <input
//                     type="text"
//                     placeholder="ຄົ້ນຫາເມນູ..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <button type="submit">ຄົ້ນຫາ</button>
//             </form>
//         </div>

//     );
// }

// export default SearchForm;
