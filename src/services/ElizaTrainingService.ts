// ElizaTrainingService.ts
interface TrainingData {
  patterns: string[];
  responses: string[];
}

class ElizaTrainer {
  private readonly trainingData: TrainingData[] = [
    {
      patterns: [
        ".*financial.*help.*",
        ".*money.*advice.*",
        ".*invest.*"
      ],
      responses: [
        "Let's discuss your financial goals carefully.",
        "Financial planning requires thoughtful consideration.",
        "I can help guide you through some financial strategies."
      ]
    },
    {
      patterns: [
        ".*save.*money.*",
        ".*budget.*",
        ".*spending.*"
      ],
      responses: [
        "Budgeting is crucial for financial health.",
        "I recommend tracking your expenses closely.",
        "Creating a savings plan can help you achieve your goals."
      ]
    }
  ];

  addPatternIfNotExists(pattern: string): string | null {
    for (const data of this.trainingData) {
      if (data.patterns.includes(pattern)) {
        return null; // Pattern already exists
      }
    }

    // If pattern doesn't exist, add it
    this.trainingData.push({
      patterns: [pattern],
      responses: ["Please provide a response to this pattern to help train me."]
    });

    return pattern; // Return added pattern
  }

  addTrainingData(newData: TrainingData) {
    this.trainingData.push(newData);
  }

  matchResponse(input: string): string {
    for (const data of this.trainingData) {
      for (const pattern of data.patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(input)) {
          return data.responses[Math.floor(Math.random() * data.responses.length)];
        }
      }
    }
    return "I'm not sure how to respond to that.";
  }
}

// Exporting the instance for use in other files
export const elizaTrainer = new ElizaTrainer();
