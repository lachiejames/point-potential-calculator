# Point Potential Calculator

A web-based calculator that helps students track their potential maximum grade in a subject based on their current assignment scores. Try it out at [point-potential-calculator.vercel.app](https://point-potential-calculator.vercel.app/)!

## Features

- Add multiple subjects to track simultaneously
- Add assignments with customizable weights for each subject
- Real-time calculation of your current grade and maximum potential grade
- Share your calculations with others via a unique URL
- Clean, intuitive interface
- Mobile-friendly design

## How It Works

1. Add a subject using the form at the top
2. For each subject, add assignments that contribute to your final grade
3. Enter the weight (percentage contribution) for each assignment - these must total 100%
4. Enter grades for completed assignments to see your current total
5. The point potential shows the highest possible grade you can achieve

## Example

If you have:
- Assignment 1 (10% weight) with a score of 80%
- Assignment 2 (20% weight) with a score of 50%

Your point potential would be 88% because:
- Lost 2% from Assignment 1 (20% of 10% weight)
- Lost 10% from Assignment 2 (50% of 20% weight)

## Development

This project is built with:
- Next.js
- React
- TypeScript
- Tailwind CSS

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The application is deployed on Vercel. Any changes pushed to the main branch will automatically trigger a new deployment.

## License

MIT
