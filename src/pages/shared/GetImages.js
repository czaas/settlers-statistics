import React, { Component } from 'react';
import firebase from 'firebase';

class GetImages extends Component {
  render() {
    if (this.props.amountOfImages) {
      for ( let i = 0; i < this.props.amountOfImages; i++) {
        let imageRef = firebase.storage().ref(`games/${ this.props.id }/${ i + 1 }.jpg`);
        imageRef.getDownloadURL().then((url) => {
          switch(i) {
            case 0:
              this.refs.imageOne.src = url;
              break;
            case 1:
              this.refs.imageTwo.src = url;
              break;
            case 2:
              this.refs.imageThree.src = url;
              break;
            default:
              break;
          }
        });
      }
    }

    return (
      <div className='images'>
        <img role="presentation" ref="imageOne" className='images__image' />
        <img role="presentation" ref="imageTwo" className='images__image' />
        <img role="presentation" ref="imageThree" className='images__image' />
      </div>
    );
  }
}

GetImages.propTypes = {
  id: React.PropTypes.string.isRequired,
  amountOfImages: React.PropTypes.number.isRequired,
};

export default GetImages;