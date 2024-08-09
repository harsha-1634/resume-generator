import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/resumepage.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getResumeRoute } from '../utils/frontendRoutes';

function Resume() {
  const [pName, setPName] = useState(null);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    image: '',
  });
  const [address, setAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [workExperience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  const [data1, setData1] = useState({});
  const [data2, setData2] = useState({});
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);
  const [data7, setData7] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rspns = await axios.get(getResumeRoute);
      const response = rspns.data;
      setPName(response[0]);
      setData1(response[1]);
      setData2(response[2]);
      setData3(response[3]);
      setData4(response[4]);
      setData5(response[5]);
      setData6(response[6]);
      setData7(response[7]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setPersonalDetails({
      ...personalDetails,
      name: data1.name,
      email: data1.email,
      phoneNumber: data1.phoneNumber,
      image: data1.image,
    });
  }, [data1]);

  useEffect(() => {
    if (data2) {
      setAddress({
        ...address,
        streetAddress: data2.streetAddress,
        city: data2.city,
        state: data2.state,
        zipCode: data2.zipCode,
        country: data2.country,
      });
    }
  }, [data2]);

  useEffect(() => {
    if (Array.isArray(data3) && data3.length > 0) {
      setEducation(data3);
    }
  }, [data3]);

  useEffect(() => {
    if (Array.isArray(data4) && data4.length > 0) {
      setAchievements(data4);
    }
  }, [data4]);

  useEffect(() => {
    if (Array.isArray(data5) && data5.length > 0) {
      setExperience(data5);
    }
  }, [data5]);

  useEffect(() => {
    if (Array.isArray(data6) && data6.length > 0) {
      setProjects(data6);
    }
  }, [data6]);

  useEffect(() => {
    if (Array.isArray(data7) && data7.length > 0) {
      setSkills(data7);
    }
  }, [data7]);

  const handleDownload = () => {
    const doc = new jsPDF();

    // Set font styles
    doc.setFont('helvetica');
    doc.setFontSize(12);

    let yOffset = 20; // Vertical offset to control the positioning

    if (personalDetails.name) {
      doc.text(personalDetails.name, 20, yOffset);
      yOffset += 10;
    }
    if (personalDetails.email && personalDetails.phoneNumber) {
      doc.text(
        personalDetails.email + ' | ' + personalDetails.phoneNumber,
        20,
        yOffset
      );
      yOffset += 10;
    }
    if (address) {
      doc.text(
        `${address.streetAddress}, ${address.city}, ${address.state}, ${address.country} - ${address.zipCode}`,
        20,
        yOffset
      );
      yOffset += 10;
    }

    if (education.length > 0) {
      yOffset += 10;
      doc.text('Education', 20, yOffset);
      const educationData = education.map((edu) => [
        edu.name,
        edu.institute,
        edu.degree,
        edu.percentage,
        edu.passingYear,
      ]);
      doc.autoTable({
        head: [['Name', 'Institute', 'Degree', 'Percentage', 'Passing Year']],
        body: educationData,
        startY: yOffset + 10,
      });
      yOffset += educationData.length * 10 + 20;
    }

    if (skills.length > 0) {
      doc.text('Skills', 20, yOffset);
      const skillsData = skills.map((skill) => [skill.name]);
      doc.autoTable({
        head: [['Skill Name']],
        body: skillsData,
        startY: yOffset + 10,
      });
      yOffset += skillsData.length * 10 + 20;
    }

    if (projects.length > 0) {
      doc.text('Projects', 20, yOffset);
      const projectsData = projects.map((project) => [
        project.project,
        project.duration,
        project.description,
      ]);
      doc.autoTable({
        head: [['Project', 'Duration', 'Description']],
        body: projectsData,
        startY: yOffset + 10,
      });
      yOffset += projectsData.length * 10 + 20;
    }

    if (achievements.length > 0) {
      doc.text('Achievements', 20, yOffset);
      const achievementsData = achievements.map((achievement) => [
        achievement.title,
        achievement.dateAchieved,
        achievement.description,
      ]);
      doc.autoTable({
        head: [['Title', 'Date Achieved', 'Description']],
        body: achievementsData,
        startY: yOffset + 10,
      });
      yOffset += achievementsData.length * 10 + 20;
    }

    if (workExperience.length > 0) {
      doc.text('Work Experience', 20, yOffset);
      const experienceData = workExperience.map((experience) => [
        experience.company,
        experience.timeperiod,
        experience.description,
      ]);
      doc.autoTable({
        head: [['Company', 'Time Period', 'Description']],
        body: experienceData,
        startY: yOffset + 10,
      });
    }

    doc.save(`${pName}.pdf`);
  };

  return (
    <div className="resume">
      <button onClick={handleDownload}>Download Resume</button>

      <h1>Resume</h1>
      <div className='resumemain'>
      <div className="personal-details">
        <h2>Personal Details</h2>
        <p>Name: {personalDetails.name}</p>
        <p>Email: {personalDetails.email}</p>
        <p>Phone: {personalDetails.phoneNumber}</p>
      </div>
      </div>
      <div className='resumemain'>
      <hr className="section-divider" />

      <div className="address">
        <h2>Address</h2>
        <p>{address.streetAddress}</p>
        <p>{address.city}</p>
        <p>{address.state}</p>
        <p>
          {address.country} - {address.zipCode}
        </p>
      </div>

      <hr className="section-divider" />

      <div className="education">
        <h2>Education</h2>
        <ul>
          {education.map((edu, index) => (
            <li key={index}>
              {edu.name}, {edu.institute}, {edu.degree}, {edu.percentage},{' '}
              {edu.passingYear}
            </li>
          ))}
        </ul>
      </div>
      </div>
      <div className='resumemain'>
      <hr className="section-divider" />

      <div className="achievements">
        <h2>Achievements</h2>
        <ul>
          {achievements.map((achievement, index) => (
            <li key={index}>
              {achievement.title}, {achievement.dateAchieved},{' '}
              {achievement.description}
            </li>
          ))}
        </ul>
      </div>

      <hr className="section-divider" />

      <div className="work-experience">
        <h2>Work Experience</h2>
        <ul>
          {workExperience.map((experience, index) => (
            <li key={index}>
              {experience.company}, {experience.timeperiod},{' '}
              {experience.description}
            </li>
          ))}
        </ul>
      </div>
      </div>
      <div className='resumemain'>
      <hr className="section-divider" />

      <div className="projects">
        <h2>Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              {project.project}, {project.duration}, {project.completionDate}
            </li>
          ))}
        </ul>
      </div>

      <hr className="section-divider" />

      <div className="skills">
        <h2>Skills</h2>
        {skills.map((item, index) => (
          <p key={index}>{item.name}</p>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Resume;
