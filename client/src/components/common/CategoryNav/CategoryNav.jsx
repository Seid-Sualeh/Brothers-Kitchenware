// import { Link } from "react-router-dom";
// import { FiMenu } from "react-icons/fi";

// const DEPTS = [
//   { label: "All", path: "/shop" },
//   { label: "Cookware", path: "/category/cookware" },
//   { label: "Dining", path: "/category/dining" },
//   { label: "Gadgets", path: "/category/gadgets" },
//   { label: "Appliances", path: "/category/appliances" },
//   { label: "Cutlery", path: "/category/cutlery" },
//   { label: "Bakeware", path: "/category/bakeware" },
//   { label: "Storage", path: "/category/storage" },
//   { label: "Coffee & Tea", path: "/category/coffee-tea" },
// ];

// export default function CategoryNav() {
//   return (
//     <div className="bg-[#1e2a2f] text-gray-100 text-sm border-b border-black/20 ">
//       <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 scroll-smooth">
//         <Link
//           to="/shop"
//           className="flex items-center gap-2 shrink-0 font-bold px-3 py-1.5 rounded hover:bg-white/10"
//         >
//           <FiMenu className="text-lg" />
//           <span>All</span>
//         </Link>
//         <span className="text-white/20 px-1">|</span>
//         {DEPTS.filter((d) => d.label !== "All").map((d) => (
//           <Link
//             key={d.path}
//             to={d.path}
//             className="shrink-0 px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap"
//           >
//             {d.label}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const DEPTS = [
  { label: "All", path: "/shop" },
  { label: "Cookware", path: "/category/cookware" },
  { label: "Dining", path: "/category/dining" },
  { label: "Gadgets", path: "/category/gadgets" },
  { label: "Appliances", path: "/category/appliances" },
  { label: "Cutlery", path: "/category/cutlery" },
  { label: "Bakeware", path: "/category/bakeware" },
  { label: "Storage", path: "/category/storage" },
  { label: "Coffee & Tea", path: "/category/coffee-tea" },
];

export default function CategoryNav() {
  return (
    <div className="bg-[#1e2a2f] text-gray-100 text-sm border-b border-black/20 ">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 scroll-smooth">
        <Link
          to="/shop"
          className="category-nav-link flex items-center gap-2 shrink-0 font-bold px-3 py-1.5 rounded hover:bg-white/10"
        >
          <FiMenu className="text-lg" />
          <span>All</span>
        </Link>
        <span className="text-white/20 px-1">|</span>
        {DEPTS.filter((d) => d.label !== "All").map((d) => (
          <Link
            key={d.path}
            to={d.path}
            className="category-nav-link shrink-0 px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap"
          >
            {d.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
