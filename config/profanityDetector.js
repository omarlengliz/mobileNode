const detectProfanityWithTogetherAI = async (text) => {
    try {
      const response = await fetch(
        'https://api.together.xyz/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer 6a50dbe4e49e7e983707298108887f41fe27b40709ee0840f9d9dcec64f4a24b`, // Replace with your Together AI API key
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            messages: [
              {
                role: 'user',
                content: `
                  Act as a text moderation system. Analyze the following text and identify any offensive or inappropriate language. This includes profanity in Arabic or English, considering variations due to slang or regional dialects.
                  
                  Respond with any detected offensive words or phrases. If the text contains no offensive language, respond with: {"badwords": []} 
                  
                  Text to analyze: "${text}"
                `,
              },
            ],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content.trim());
  
      // Check if the badwords array is empty or contains offensive words
      if (result.badwords.length === 0) {
        console.log("No offensive language detected.");
      } else {
        console.log("Offensive language detected:", result);
      }
  
      return result;
    } catch (error) {
      console.error("Error detecting profanity:", error);
      return { badwords: [] }; // Default response in case of an error
    }
  };
  

  module.exports = detectProfanityWithTogetherAI;
