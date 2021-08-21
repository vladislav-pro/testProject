import React from 'react';
import UserReviewsList from './UserReviewsList';

function UserReviewsListDisplay({reviews}) {
   const reviewsElements = reviews.map(review =>
      <div key = {review.id}>
         <UserReviewsList review = {review}/>
      </div>
      )
   return (
      <div>
         {reviewsElements}
      </div>
   )
}

export default UserReviewsListDisplay