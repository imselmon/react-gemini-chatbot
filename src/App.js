import React, { useState, useEffect } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
const { GoogleGenerativeAI } = require("@google/generative-ai");

function Chatbot() {
            const [messages, setMessages] = useState([]);
            const [input, setInput] = useState('');
            const [loading, setLoading] = useState(false);

            useEffect(() => {
              // No initial message here
            }, []);

            const handleMessageSend = async () => {
              if (input.trim() !== '') {
                const newMessage = { text: input, sender: 'user' };
                setMessages(prevMessages => [...prevMessages, newMessage]);
                setInput('');
                setLoading(true);

                const safetySettings = [
                  {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                  },
                  {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                  },
                ];
                const generationConfig = {
                  stopSequences: ["red"],
                  maxOutputTokens: 200,
                  temperature: 0.9,
                  topP: 0.1,
                  topK: 16,
                };

                try {
                  const genAI = new GoogleGenerativeAI("AIzaSyAoO-FSPCfMJ-7itKo6mPQOeBN1g0DB4aQ");
                  const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-pro",
                    systemInstruction: `
              You are an AI educational consultant named EduCo. Your role is to provide expert guidance on academic and career-related topics, helping students, professionals, and lifelong learners make informed decisions. You offer personalized recommendations on courses, study techniques, exam preparation, scholarships, career paths, and educational trends.
          
              Your responses should be:
              - Clear, concise, and professional.
              - Well-structured, breaking down complex topics into simpler terms.
              - Encouraging and motivational, fostering a growth mindset.
              - Backed by relevant research, practical advice, and real-world applications.
              - Adaptable to different learning styles and academic backgrounds.
          
              Your key areas of expertise include:
              - Higher education planning (college/university selection, admission guidance).
              - Study strategies (effective learning techniques, time management).
              - Career counseling (choosing majors, job market trends, skill development).
              - Online learning (MOOCs, certification courses, e-learning platforms).
              - Scholarship and funding opportunities.
              - Exam preparation (standardized tests like SAT, GRE, IELTS, etc.).
              - Soft skills and professional development (resume writing, interview preparation).
          
              Your tone should be supportive, insightful, and engaging. If a user asks for incorrect or misleading information, politely correct them and guide them toward the right resources. Always prioritize accuracy, clarity, and the best interests of the learner.`
                  , generationConfig,
                    safetySettings
                  });

                  const chat = model.startChat();
                  const result = await chat.sendMessage(`
                  You are an AI educational consultant named EduCo. Your role is to provide expert guidance on academic and career-related topics, helping students,
                 User Input :  ${input}
                  `);
                  const response = await result.response;
                  const text = response.text();
                  const botMessage = { text: text, sender: 'bot' };
                  setMessages(prevMessages => [...prevMessages, botMessage]);
                } catch (error) {
                  console.error("Error sending message to bot:", error);
                } finally {
                  setLoading(false);
                }
              }
            };

            return (
              <div className="chat-container">
                <h1 className="chat-title">
                <img src="/logo.png"  alt="logo"/>
                </h1>
                <h2 className="chat-heading">Welcome to your personalized educational counseling assistant!</h2>
                <div className="chat-box">
                  {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                      {message.sender === 'bot' ? (
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      ) : (
                        message.text
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="message bot">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleMessageSend();
                      }
                    }}
                  />
                  <button onClick={handleMessageSend}>Send</button>
                </div>
              </div>
            );
          }

          export default Chatbot;
