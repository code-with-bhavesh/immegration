// import { Button } from "@material-tailwind/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  CircularProgress,
  Button
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../store/store";
import { updateAssociation } from "../../store/thunk/documentThunk";

export function UpdateAssociationDialog({
  open,
  handleClose,
  association,
}: any) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [btnLoading, setBtnLoading] = useState<any>(false);

  const handleChangeField = (event: any) => {
    setName(event.target.value);
  };

  const handleUpdate = (event: any) => {
    if (!name) {
      setError("Name field is required.");
      return false;
    } else {
      let _request = {
        id: association?.id,
        name: name,
      };
      setBtnLoading(true);
      dispatch(updateAssociation(_request)).then((res: any) => {
        setBtnLoading(false);
        handleClose();
      });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { borderRadius: "14px" } }}
    >
      <DialogContent>
        <span className="text-lg font-bold text-gray-900">
          To Update the "{association?.type || ""}"
        </span>
        <TextField
          value={name}
          autoFocus
          margin="dense"
          id="name"
          label="name"
          type="text"
          fullWidth
          variant="standard"
          onChange={handleChangeField}
          error={error ? true : false}
          helperText={error ? error : ""}
        />
      </DialogContent>
      {/* <DialogActions> */}
      <div className="flex justify-center mb-4">
        <Button
          disabled={btnLoading}
          onClick={handleUpdate}
          sx={{
            backgroundColor: "#2563EB",
            minWidth: '90px',
            boxShadow: 'none',
            borderRadius: '100px',
            textTransform: 'capitalize',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          className=""
          // className="bg-[#2563EB] min-w-[90px] shadow-none rounded-[100px] capitalize flex items-center justify-center"
        >
          {btnLoading ? (
            <CircularProgress size={16} sx={{ color: "#fff" }} />
          ) : (
            <span className="text-[12px]">Update</span>
          )}
        </Button>
      </div>
      {/* </DialogActions> */}
    </Dialog>
  );
}
