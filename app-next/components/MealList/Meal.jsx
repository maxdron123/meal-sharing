import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";

export default function Meal({ meal }) {
  return (
    <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
      <Card
        sx={{
          height: "100%",
          width: "100%", // Make card fill the grid cell
          display: "flex",
          flexDirection: "column",
          maxWidth: { xs: "100%", sm: 400 }, // Optional: limit max width on sm+
          margin: "0 auto", // Center if maxWidth is less than 100%
        }}
      >
        <CardMedia component="img" height="140" alt={meal.title} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {meal.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {meal.description}
          </Typography>
          <Rating
            name="read-only"
            value={meal.rating}
            readOnly
            precision={0.5}
          />
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Paper>
  );
}
