# Pneumonia_Detection_App

# Pneumonia Detection Web Application  
A full-stack web application that leverages **deep learning** to detect pneumonia from chest X-ray images. The system integrates a custom-trained AI model with a secure backend and an intuitive frontend, enabling users to upload medical images and receive predictions in real time.  

---

## Overview  
The application combines modern web development practices with applied machine learning in healthcare.  
- **Frontend:** Built with **React** for a responsive and user-friendly interface.  
- **Backend:** Developed with **Flask**, ensuring secure data handling and smooth communication with the AI model.  
- **Database:** Managed with **SQLAlchemy** and **SQLite**, supporting session-based authentication and user management.  
- **AI Model:** Based on **MobileNetV2** with transfer learning, fine-tuned for pneumonia detection on X-ray images.  

---

## Features  
- **User Authentication & Security**  
  - Secure, session-based authentication  
  - Passwords handled safely with hashing and robust mechanisms (**Bcrypt**)
- **Image Upload & Prediction**  
  - Upload chest X-ray images through a simple UI  
  - Receive predictions powered by the integrated MobileNetV2 model  
- **Data Management**  
  - Save results as a local file  
  - Option to send results directly to an email address  
- **Performance Metrics**  
  - Model evaluated using **accuracy, precision, and recall**  
  - Achieved **87% accuracy** in pneumonia detection  
- **User Experience**  
  - Intuitive, clean, and responsive UI  
  - Designed to make medical image evaluation accessible to non-technical users  

---

## AI Model  
- **Base architecture:** MobileNetV2 (TensorFlow pretrained model)  
- **Method:** Transfer learning with custom modifications  
- **Goal:** Enhance pneumonia detection while maintaining efficiency  
- **Performance:**  
  - Accuracy: **87%**  
  - Balanced **precision** and **recall** for reliable classification  

---

## Tech Stack  
**Frontend:**  
- React  
**Backend:**  
- Flask  
**Database & Authentication:**  
- SQLAlchemy  
- SQLite  
- Session-based authentication
- Bcrypt
**AI/ML:**  
- TensorFlow / Keras  
- MobileNetV2 (transfer learning)  

---

## Future Improvements  
- Add role-based access for doctors/patients  
- Enable cloud storage for secure medical history tracking  
- Integrate visualization tools for explainability  
