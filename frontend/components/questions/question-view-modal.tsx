"use client";

import { Question } from "@/lib/schemas/question-schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface QuestionViewModalProps {
  data: Question | undefined;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const QuestionViewModal: React.FC<QuestionViewModalProps> = ({ ...props }) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  return (
    props.showModal && (
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.data?.title}</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent>
              <form>
                <div className="m-4">
                  <Label>Category</Label>
                  <Input
                    value={props.data?.category}
                    className="mt-2"
                    readOnly
                  />
                </div>
                <div className="m-4">
                  <Label>Complexity</Label>
                  <Input
                    value={props.data?.complexity}
                    className="mt-2"
                    readOnly
                  />
                </div>
                <div className="m-4">
                  <Label>Description</Label>
                  <Textarea
                    value={props.data?.description}
                    className="mt-2"
                    disabled
                  />
                </div>
              </form>
            </CardContent>
          </Card>
          <DialogFooter>
            <Button variant="destructive" onClick={closeModal}>
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
};

export default QuestionViewModal;
