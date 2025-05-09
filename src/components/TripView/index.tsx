import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";

const TripView = () => {
  const tags = ["historical", "national park"];

  return (
    <Grid
      size={{lg: 3, xl: 4}}
      display="flex"
      flexDirection="column"
      maxHeight={350}
      pb={1}
      sx={{
        bgcolor: "white",
        border: "0 solid transparent",
        borderRadius: 2,
      }}
    >
      {/* image */}
      <Box
        component="img"
        // src="src/assets/Lincoln_Memorial.jpeg"
        src="src/assets/test.jpg"
        sx={{
          width: "100%",
          height: 150,
          objectFit: "cover",
          border: "0 solid transparent",
          borderRadius: 2,
        }}
      />

      {/* content creator & duration */}
      <Box height={30} ml={1} mt={-4.5} display="flex">
        <Avatar
          alt="creator"
          sx={{ width: 30, height: 30, cursor: "pointer" }}
        />
        <Typography
          fontFamily="noto serif"
          variant="body2"
          my={0.5}
          mr={0}
          ml="auto"
          sx={{
            cursor: "pointer",
            border: "0 solid transparent",
            borderRadius: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            bgcolor: green[800],
            color: "white",
            px: 1,
            ":hover": {
              filter: "brightness(1.2)",
            },
          }}
        >
          1D
        </Typography>
      </Box>

      <Box>
        {/* name */}
        <Typography
          fontFamily="tagesschrift"
          variant="body1"
          mt={1}
          mx={0.5}
          sx={{
            cursor: "pointer",
            ":hover": {
              color: "primary.main",
            },
          }}
        >
          Lincoln Memorial Hall
        </Typography>

        {/* address */}
        <Box>
          <Typography
            fontFamily="noto serif"
            variant="body2"
            mx={0.25}
            sx={{
              cursor: "pointer",
              ":hover": {
                color: "primary.main",
              },
            }}
          >
            Washington D.C.
          </Typography>
        </Box>

        {/* tags */}
        <Box display="flex" flexDirection="row">
          {tags.map((tag) => (
            <Chip
              key={`trip-view-tag-${tag}`}
              label={tag}
              size="small"
              sx={{
                fontSize: 12,
                m: 0.5,
                color: "white",
                bgcolor: grey[600],
                cursor: "pointer",
                fontFamily: "noto serif",
                ":hover": {
                  filter: "brightness(1.1)",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Grid>
  );
};

export default TripView;
