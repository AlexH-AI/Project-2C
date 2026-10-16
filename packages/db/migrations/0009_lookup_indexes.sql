CREATE INDEX `appointments_customer` ON `appointments` (`customer_id`);--> statement-breakpoint
CREATE INDEX `policies_customer` ON `policies` (`customer_id`);--> statement-breakpoint
CREATE INDEX `stage_transitions_appointment` ON `stage_transitions` (`appointment_id`);