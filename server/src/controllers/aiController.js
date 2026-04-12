import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @desc    Analyze Resume Text against standard tech-industry patterns
 * @route   POST /api/ai/analyze-resume
 * @access  Private
 */
export const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400);
      throw new Error('Please provide resume text for analysis.');
    }

    const prompt = `You are an elite Senior Tech Recruiter. Analyze the following resume text and respond ONLY in valid JSON format. Provide 3 specific strengths, 3 weaknesses, and 3 actionable suggestions for improvement.
    The required JSON schema is:
    {
      "strengths": ["...", "...", "..."],
      "weaknesses": ["...", "...", "..."],
      "suggestions": ["...", "...", "..."]
    }

    Resume Text:
    ${resumeText}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    res.json(parsedResponse);
  } catch (error) {
    if (error.code === 'invalid_api_key') {
       res.status(500);
       return next(new Error('OpenAI API Configuration is invalid or missing.'));
    }
    next(error);
  }
};

/**
 * @desc    Generate generic step-by-step career path structure
 * @route   POST /api/ai/career-roadmap
 * @access  Private
 */
export const generateRoadmap = async (req, res, next) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      res.status(400);
      throw new Error('Please provide career goal parameters.');
    }

    const prompt = `You are an expert Career Coach mentoring a junior technologist. Generate a detailed roadmap to achieve the goal: "${goal}".
    Respond ONLY in valid JSON format using the exact schema below:
    {
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "recommendedTechnologies": ["tech1", "tech2", "tech3"],
      "roadmap": [
        { "step": "Step 1 name", "description": "Details about step 1" },
        { "step": "Step 2 name", "description": "Details about step 2" }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    res.json(parsedResponse);
  } catch (error) {
     next(error);
  }
};

/**
 * @desc    Generates Skills Gap Analysis matrix
 * @route   POST /api/ai/skills-gap
 * @access  Private
 */
export const analyzeSkillsGap = async (req, res, next) => {
  try {
    const { currentSkills, targetRole } = req.body;

    if (!currentSkills || !targetRole) {
      res.status(400);
      throw new Error('Please provide both currentSkills and targetRole.');
    }

    const prompt = `You are an expert Technical Hiring Manager.
    Compare these current skills: [${currentSkills.join(', ')}] against the requirements for this target role: "${targetRole}".
    Respond ONLY in valid JSON format utilizing this schema sequence:
    {
      "missingSkills": ["skill needed 1", "skill needed 2"],
      "priorityLearningList": [
        { "skill": "Most critical missing skill", "reason": "Why learn this first" }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    res.json(parsedResponse);
  } catch (error) {
    next(error);
  }
};
