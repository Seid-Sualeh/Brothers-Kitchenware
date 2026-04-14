
import style from "./catagory.module.css"
import {Link} from 'react-router-dom'
function CatagoryCard({data}) {
  return (
    <div className={style.catagory}>
          <Link to={`/catagory/${data.name}`}>
              <span>
                  <h2>{data.title}</h2>
                  <img src={data.imgLink} alt="" />
                  <p>Shoping</p>
              </span>
          </Link>
    </div>
  )
}

export default CatagoryCard