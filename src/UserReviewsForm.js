import React, {Component} from 'react';
import FormErrors  from './FormErrors';
import UserReviewsListDisplay from './UserReviewsListDisplay';
import axios from 'axios'
// import reviews from './exemples'

class UserReviewsForm extends Component{
   state = {
      name: '',
      message: '', 
      formErrors: {name: '', message: ''},
      nameValid: false,
      messageValid: false,
      formValid: false,
      reviews: [],
      page: 0,
      lastPage: 0
   }

   componentDidMount() {
      this.loadReviews()
   }

   loadReviews = ( page = 1, rewrite = false ) => {
      axios.get('https://jordan.ashton.fashion/api/goods/30/comments', {params: {page} }).then((response) => {
         this.setState({
            reviews: rewrite ? response.data.data : [...this.state.reviews, ...response.data.data],
            page: response.data.current_page,
            lastPage: response.data.last_page,
         })
      })
   }

   showMore = () => {
      this.loadReviews(this.state.page + 1)
   }

   showPrev = () => {
      this.loadReviews(this.state.page - 1, true)
   }

   showNext = () => {
      this.loadReviews(this.state.page + 1, true)
   }
   showLast = () => {
      this.loadReviews(this.state.lastPage, true)
   }

   handleUserInput = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({[name]: value},
           () => { this.validateField(name, value) });
   }

   validateField(fieldName, value) {
      let fieldValidationErrors = this.state.formErrors;
      let nameValid = this.state.nameValid;
      let messageValid = this.state.messageValid;
  
      switch(fieldName) {
        case 'name':
          nameValid = value.length >=1;
          fieldValidationErrors.name = nameValid ? '' : ' is too short';
          break;
        case 'message':
          messageValid = value.length >= 3;
          fieldValidationErrors.message = messageValid ? '': ' is too short';
          break;
        default:
          break;
      }
      this.setState({formErrors: fieldValidationErrors,
            nameValid: nameValid,
            messageValid: messageValid
         }, this.validateForm);
   }
    
   validateForm() {
      this.setState({formValid: this.state.nameValid && this.state.messageValid});
   }
  
   errorClass(error) {
      return(error.length === 0 ? '' : 'has-error');
   }

   submit = (event) => {
      event.preventDefault()
      axios.post('https://jordan.ashton.fashion/api/goods/30/comments', {name:this.state.name, text:this.state.message}).then(()=>{
         if(this.state.page === this.state.lastPage){
            this.setState({
               reviews:[...this.state.reviews, {name:this.state.name, text:this.state.message}]
            })
         }
         this.setState({
            name:'',
            message:''
         })
      })
   }

   render() {
      const {name, message} = this.state
      return(
         <div >
            <div >
            <FormErrors formErrors={this.state.formErrors} />
            </div>
            <div className={`form-group ${this.errorClass(this.state.formErrors.name)}`}>
               Name: <input name = 'name' value = {name} onChange = {this.handleUserInput}/>
            </div>
            <div className={`form-group ${this.errorClass(this.state.formErrors.message)}`}>
               Text: <textarea name = 'message' value = {message} onChange = {this.handleUserInput}/>
            </div>
            <button type = 'submit' disabled = {!this.state.formValid} onClick = {this.submit}>Send Reviews</button>
            <div>
               <UserReviewsListDisplay reviews = {this.state.reviews}/>
               {(this.state.page !== this.state.lastPage) && <button onClick = {this.showMore}>Show more review</button>}
               <div>
                  <button disabled = {this.state.page === 1 } onClick = {this.showPrev}>previous page</button>
                  <span>{this.state.page}/{this.state.lastPage}</span>
                  <button disabled = {this.state.page === this.state.lastPage } onClick = {this.showNext}>next page</button>
                  <button disabled = {this.state.page === this.state.lastPage } onClick = {this.showLast}>last Page</button>
               </div>
            </div>
         </div>
      )
   }
}

export default UserReviewsForm;