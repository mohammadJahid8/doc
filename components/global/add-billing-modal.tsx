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
import { CalendarIcon, Plus, Trash } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function AddBillingModal() {
  const [inputs, setInputs] = useState<any>({
    items: [{ name: "", amount: "" }],
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<any>();
  const { user, billingRefetch, setBillingRefetch, appointments } =
    useAppContext();

  const appointmentsData = appointments?.filter(
    (appointment: any) => appointment?.doctor?.email === user?.email
  );

  const patientNames = appointmentsData?.map(
    (appointment: any) => appointment?.patientName
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    inputs.date = format(date, "PPP");
    inputs.doctor = user?._id;

    try {
      const promise = await api.post(`/billing/create`, inputs);

      if (promise.status === 200) {
        setBillingRefetch(!billingRefetch);
        setInputs({ items: [] });
        setOpen(false);
        toast.success(`New billing added.`, {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.log(error);
      setInputs({ items: [] });
      return toast.error(`Failed to add new billing!`, {
        position: "top-center",
      });
    }
  };

  const handleAddItem = () => {
    setInputs({
      ...inputs,
      items: [...inputs.items, { name: "", amount: "" }],
    });
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedItems = [...inputs.items];
    updatedItems[index][field] = value;
    setInputs({ ...inputs, items: updatedItems });
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = [...inputs.items];
    updatedItems.splice(index, 1);
    setInputs({ ...inputs, items: updatedItems });
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
            <Select
              onValueChange={(value) =>
                setInputs({ ...inputs, patientName: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patientNames?.map((patientName: string) => (
                  <SelectItem key={patientName} value={patientName}>
                    {patientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Input
              id="phoneNumber"
              type="number"
              className=""
              placeholder="Phone Number"
              required //phone number must be more than 8 digit
              onChange={(e) =>
                setInputs({ ...inputs, phoneNumber: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <Input
              id="email"
              type="email"
              className=""
              placeholder="Email"
              required //required for razorpay to send invoice to the email
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>

          <div className="grid gap-4">
            {inputs.items.map((item: any, index: number) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Item Name"
                    className="flex-1"
                    value={item.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    className="flex-1"
                    value={item.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    required
                  />
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteItem(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddItem}>
              Add Item
            </Button>
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
          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}