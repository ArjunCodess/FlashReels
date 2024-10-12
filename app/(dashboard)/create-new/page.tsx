"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import SelectTopic from "@/components/dashboard/select-topic";
import SelectStyle from "@/components/dashboard/select-style";
import SelectDuration from "@/components/dashboard/select-duration";

export default function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [inputValue, setInputValue] = useState({
    fieldName: "",
    fieldValue: "",
  });

  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue.fieldName && debouncedInputValue.fieldValue) {
      console.log(
        debouncedInputValue.fieldName,
        debouncedInputValue.fieldValue
      );
    }
  }, [debouncedInputValue]);

  const onHandleInputChange: OnUserSelectType = useCallback(
    (fieldName, fieldValue) => {
      setInputValue({ fieldName, fieldValue });
      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldValue,
      }));
    },
    []
  );

  return (
    <div className="py-4 px-8 mx-auto">
      <h1 className="text-2xl font-bold mt-2 mb-4">Create New</h1>

      <div className="space-y-8">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
      </div>

      <Button className="w-full mt-8" size="lg">
        Create
      </Button>
    </div>
  );
}
