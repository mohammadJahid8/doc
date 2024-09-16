/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CalendarIcon, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import api from "@/utils/axiosInstance";
import { useAppContext } from "@/lib/context";
import { toast } from "sonner";

export function AddBillingModal() {
  const [inputs, setInputs] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<any>();
  const { user, billingRefetch, setBillingRefetch } = useAppContext();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    inputs.date = format(date, "PPP");
    inputs.doctor = user?._id;

    try {
      const promise = await api.post(`/billing/create`, inputs);
      if (promise.status === 200) {
        setBillingRefetch(!billingRefetch);
        setInputs({});
        setOpen(false);
        toast.success(`New billing added.`, {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.log(error);

      return toast.error(
        error.response.data.message || `Failed to add new billing!`,
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm">
          <Plus className="mr-2 h-4 w-4" /> Add New Billing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new billing</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="name" className="">
              Patient Name
            </Label>
            <Input
              id="name"
              className=""
              onChange={(e) =>
                setInputs({ ...inputs, patientName: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="username" className="">
              Phone Number
            </Label>
            <Input
              type="number"
              className=""
              required
              onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="username" className="">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  // initialFocus
                  required
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Label htmlFor="username" className="">
              Amount
            </Label>
            <Input
              type="number"
              className=""
              required
              onChange={(e) => setInputs({ ...inputs, amount: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
