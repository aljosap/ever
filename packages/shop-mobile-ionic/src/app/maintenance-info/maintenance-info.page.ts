import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '@modules/client.common.angular2/services/maintenance.service';
import { environment } from 'environments/environment';
import { Store } from 'app/services/store.service';
import { Router } from '@angular/router';

@Component({
	selector: 'e-cu-maintenance-info',
	templateUrl: './maintenance-info.page.html',
	styleUrls: ['./maintenance-info.page.scss'],
})
export class MaintenanceInfoPage implements OnInit {
	public message;
	constructor(
		private maintenanceService: MaintenanceService,
		private store: Store,
		private router: Router
	) {
		this.getMessage();
		this.getStatus();
	}

	ngOnInit() {}

	async getMessage() {
		this.message = await this.maintenanceService.getMessage(
			this.store.maintenanceMode,
			environment['SETTINGS_MAINTENANCE_API_URL']
		);
	}

	private async getStatus() {
		const interval = setInterval(async () => {
			const status = await this.maintenanceService.getStatus(
				environment['SETTINGS_APP_TYPE'],
				environment['SETTINGS_MAINTENANCE_API_URL']
			);
			console.warn(
				`Maintenance on '${this.store.maintenanceMode}': ${status}`
			);

			if (!status) {
				clearInterval(interval);
				this.store.clearMaintenanceMode();
				this.router.navigate(['']);
			}
		}, 5000);
	}
}
