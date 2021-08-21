
function UserReviewsList(props) {
   const {review} = props
   const body = <section>{review.text}</section>
   return (
      <div>
         <h3>
            {review.name}
         </h3>
         <h5>
            {body}
         </h5>
      </div>
   )
}

export default UserReviewsList;