import logoWhite from '../assets/elements/logo-white.png';
import logoRed from '../assets/elements/logo-red.png';
import bg from '../assets/elements/bg.jpg';
import bg2 from '../assets/elements/bg-2.jpg';

function ImageTest() {
  return (
    <div>
      <img src={logoWhite} alt="Logo White" />
      <img src={logoRed} alt="Logo Red" />
      <div style={{ backgroundImage: `url(${bg})`, height: '200px', width: '200px' }}></div>
      <div style={{ backgroundImage: `url(${bg2})`, height: '200px', width: '200px' }}></div>
    </div>
  );
}

export default ImageTest; 