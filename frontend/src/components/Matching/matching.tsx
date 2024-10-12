import * as React from "react";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

const complexities = ["Easy", "Medium", "Hard"];
const categories = ["Algorithms", "Arrays", "Bit Manipulation", "Brainteaser", "Data Structures", "Databases", "Recursion", "Strings"];

export default function MatchingDialog({ open, handleMatchScreenClose } : { open: boolean, handleMatchScreenClose: () => void }) {
  const [matching, setMatching] = React.useState(false);
  const [complexity, SetComplexity] = React.useState("");
  const [category, SetCategory] = React.useState("");

  const handleClose = () => {
    if (matching) {
      toast.error("Cannot close screen while matching!");
      return;
    }
    handleMatchScreenClose();
  }

  const handleMatch = () => {
    console.log(`Looking for match with ${category} on ${complexity} difficulty`)
    setMatching(!matching);
  }

  const handleChangeComplexity = (event: SelectChangeEvent) => {
    SetComplexity(event.target.value);
  }

  const handleChangeCategory = (event: SelectChangeEvent) => {
    SetCategory(event.target.value);
  }
  
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="matching-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: "2rem" }} id="matching-dialog-title">
        Find Peer
      </DialogTitle>
      <IconButton
        aria-label="close"
        disabled={matching}
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography>
          Select the category and difficulty of questions you are interested in doing:
        </Typography>
        <div className="py-8 flex justify-center">
          <FormControl sx={{ m: 1, minWidth: 140 }}>
            <InputLabel id="complexity-select-label">Complexity</InputLabel>
            <Select
              labelId="complexity-select"
              id="complexity-select"
              value={complexity}
              label="Complexity"
              disabled={matching}
              onChange={handleChangeComplexity}
            >
              {complexities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 180 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select"
              id="category-select"
              value={category}
              label="Category"
              disabled={matching}
              onChange={handleChangeCategory}
            >
              {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <Typography variant="h6" align="center">
          {matching ? "Finding peer..." : <br />}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button autoFocus variant="contained" color={matching ? "error" : "primary"} onClick={handleMatch} sx={{ minWidth: 90 }}>
          {matching ? "Cancel" : "Match"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
