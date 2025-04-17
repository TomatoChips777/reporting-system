// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const { exec } = require('child_process');


// const formatDataLabeled = (data) => {
//     const dateOptions = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//     };

//     const today = new Date().toLocaleString(undefined, dateOptions);

//     return data.map((report, index) => {
//       return `Report ${index + 1}:
//     - ID: ${report.id}
//     - Location: ${report.location}
//     - Description: ${report.description}
//     - Category: ${report.category}
//     - Priority: ${report.priority}
//     - Status: ${report.status}
//     - Reporter: ${report.reporter_name}
//     - Anonymous: ${report.is_anonymous ? 'Yes' : 'No'}
//     - Assigned Staff: ${report.assigned_staff || 'None'}
//     - Created At: ${new Date(report.created_at).toLocaleString(undefined, dateOptions)}
//     - Date Updated: ${new Date(report.updated_at).toLocaleString(undefined, dateOptions)}
//     - Reference Date Today: ${today}
//     `;
//     }).join('\n');
//   };

// // Format data into labeled format instead of JSON
// // const formatDataLabeled = (data) => {
// //     return data.map((report, index) => {
// //       return `Report ${index + 1}:
// //   - ID: ${report.id}
// //   - Location: ${report.location}
// //   - Description: ${report.description}
// //   - Category: ${report.category}
// //   - Priority: ${report.priority}
// //   - Status: ${report.status}
// //   - Reporter: ${report.reporter_name}
// //   - Anonymous: ${report.is_anonymous ? 'Yes' : 'No'}
// //   - Assigned Staff: ${report.assigned_staff || 'None'}
// //   - Created At: ${new Date(report.created_at).toLocaleString()}
// //   - Updated At: ${new Date(report.updated_at).toLocaleString()}
// //   `;
// //     }).join('\n');
// //   };
//   const formatLostAndFoundLabeled = (items, claimsByItem = []) => {
//     return items.map((item, index) => {
//       let text = `Item ${index + 1}:
//   - Item Name: ${item.item_name}
//   - Type: ${item.type}
//   - Category: ${item.category}
//   - Description: ${item.description}
//   - Location: ${item.location}
//   - Reported By: ${item.user_name}
//   - Status: ${item.status}
//   - Date Reported: ${item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
//   - Anonymous: ${item.is_anonymous ? 'Yes' : 'No'}`;

//       // Check if item has claim data in claimsByItem
//       const itemClaims = claimsByItem.filter(claim => claim.item_id === item.id);
//       if (itemClaims.length > 0) {
//         const claim = itemClaims[0];
//         text += `
//   - Claimed By: ${claim.claimer_name}
//   - Claim Status: ${claim.status}
//   - Remarks: ${claim.remarks}
//   - Claim Date: ${claim.created_at ? new Date(claim.created_at).toLocaleString() : 'N/A'}`;
//       }

//       return text;
//     }).join('\n\n');
//   };

//   // Prompt generator using labeled data
//   const generatePrompt = (data, question) => `
//   You are a helpful and knowledgeable data analyst. Your task is to analyze the following maintenance report data and provide clear,
//   informative, and concise answers based on the user's question. Ignore unrelated questions.

//   Here is the analytics data:
//   ${formatDataLabeled(data)}

//   Use this data to explain trends, summarize important insights, or propose solutions related to the question.

//   User's question: ${question}
//   `;

// // Prompt generator
// // const generatePrompt = (data, question) => `
// // You are a helpful and knowledgeable data analyst. Your task is to analyze the following analytics data and provide clear,
// //  informative, and direct to the point answers based on the user's question also ignore not related questions.

// // Here is the analytics data:
// // ${formatLostAndFoundLabeled(data.data.items, data.claims_by_item)}

// // Use this data to explain trends, summarize important information, or provide any insights,  or add solutions to the issues relevant to the question.

// // User's question: ${question}
// // `;

// // POST endpoint for LLM analysis
// router.post('/', async (req, res) => {
//   const { reportType, question } = req.body;

//   if (!question) {
//     return res.status(400).json({ success: false, message: "Missing question" });
//   }

//   try {
//     const response = await axios.get(`http://localhost:5000/api/reports/${reportType}`);
//     // const response = await axios.get(`http://localhost:5000/api/lostandfound/all-data`);
//     const data = response.data;
//     const prompt = generatePrompt(data, question);

//     const command = `ollama run llama3.2`;
//     const child = exec(command, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Ollama error:", err);
//         return res.status(500).json({ success: false, message: "Ollama error", error: err.message });
//       }
//       if (stderr) {
//         console.warn("Ollama stderr:", stderr);
//       }
//       res.json({ success: true, answer: stdout.trim() });
//     });

//     child.stdin.write(prompt);
//     child.stdin.end();

//   } catch (err) {
//     console.error("Failed to fetch analytics or process prompt:", err);
//     res.status(500).json({ success: false, message: "Internal error", error: err.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const axios = require('axios');
const { exec } = require('child_process');
const db = require('../config/db');

const formatLostAndFoundLabeled = (items, claimsByItem = []) => {
  return items.map((item, index) => {
    let text = `Item ${index + 1}:
  - Item Name: ${item.item_name}
  - Type: ${item.type}
  - Category: ${item.category}
  - Description: ${item.description}
  - Location: ${item.location}
  - Reported By: ${item.user_name}
  - Status: ${item.status}
  - Date Reported: ${item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
  - Anonymous: ${item.is_anonymous ? 'Yes' : 'No'}`;

    // Check if item has claim data in claimsByItem
    const itemClaims = claimsByItem.filter(claim => claim.item_id === item.id);
    if (itemClaims.length > 0) {
      const claim = itemClaims[0];
      text += `
  - Claimed By: ${claim.claimer_name}
  - Claim Status: ${claim.status}
  - Remarks: ${claim.remarks}
  - Claim Date: ${claim.created_at ? new Date(claim.created_at).toLocaleString() : 'N/A'}`;
    }

    return text;
  }).join('\n\n');
};

const formatDataLabeled = (data, reportType) => {
  console.log(reportType);

  if (reportType === 'lost-and-found-analytics') {
    return formatLostAndFoundLabeled(data.data.items, data.claims_by_item);
  }
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const today = new Date().toLocaleString(undefined, dateOptions);

    return data.map((report, index) => {
      return `Report ${index + 1}:
      - ID: ${report.id}
      - Location: ${report.location}
      - Description: ${report.description}
      - Category: ${report.category}
      - Priority: ${report.priority}
      - Status: ${report.status}
      - Reporter: ${report.reporter_name}
      - Anonymous: ${report.is_anonymous ? 'Yes' : 'No'}
      - Assigned Staff: ${report.assigned_staff || 'None'}
      - Created At: ${new Date(report.created_at).toLocaleString(undefined, dateOptions)}
      - Date Updated: ${new Date(report.updated_at).toLocaleString(undefined, dateOptions)}
      - Reference Date Today: ${today}
      `;
    }).join('\n');
};

const generatePrompt = (data, question, history, reportType) => `

  You are a helpful and knowledgeable data analyst. Your task is to analyze the following report data and provide clear,
  informative, and concise answers based on the user's question. Ignore unrelated questions.
  
  Note please make sure to review the answer.
  Here is the analytics data:
  ${formatDataLabeled(data, reportType)}
  
  Use this data to explain trends, summarize important insights, or propose solutions related to the question also apply the chat history to make better response.
  
  Chat history: ${history}

  User's question: ${question}
  `;
// Utility function to save the conversation in MySQL
const saveConversation = (userId, reportType) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO chatbot_conversations (user_id, category) VALUES (?, ?)';
    db.query(query, [userId, reportType], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.insertId);  // Return the conversation ID
    });
  });
};

// Utility function to save a message in MySQL
const saveMessage = (conversationId, sender, text) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO chatbot_messages (conversation_id, sender, text) VALUES (?, ?, ?)';
    db.query(query, [conversationId, sender, text], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.insertId);  // Return the message ID
    });
  });
};

// POST endpoint for LLM analysis
router.post('/', async (req, res) => {
  const { userId, reportType, question, history } = req.body;

  if (!question) {
    return res.status(400).json({ success: false, message: "Missing question" });
  }

  try {
    // Check if the conversation already exists for the user
    let conversationId;
    const findConversationQuery = 'SELECT id FROM chatbot_conversations WHERE user_id = ? AND category=? ORDER BY started_at DESC LIMIT 1';

    db.query(findConversationQuery, [userId, reportType], async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
      }

      // If no conversation found, create a new one
      if (results.length === 0) {
        conversationId = await saveConversation(userId, reportType);
      } else {
        conversationId = results[0].id;
      }

      // Save the user's message to the database
      await saveMessage(conversationId, 'user', question);

      // Fetch the necessary report data
      const response = await axios.get(`http://localhost:5000/api/reports/${reportType}`);
      const data = response.data;
      const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`).join('\n');
      const prompt = generatePrompt(data, question, formattedHistory, reportType);

      // Process the prompt with the LLM model
      const command = `ollama run llama3.2`;
      const child = exec(command, async (err, stdout, stderr) => {
        if (err) {
          console.error("Ollama error:", err);
          return res.status(500).json({ success: false, message: "Ollama error", error: err.message });
        }
        if (stderr) {
          console.warn("Ollama stderr:", stderr);
        }

        // Save the bot's response to the database
        const botReply = stdout.trim();
        await saveMessage(conversationId, 'bot', botReply);

        // Return the bot's response to the frontend
        res.json({ success: true, answer: botReply });
      });

      // Write the prompt to the child process
      child.stdin.write(prompt);
      child.stdin.end();
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ success: false, message: "Internal error", error: err.message });
  }
});

module.exports = router;
