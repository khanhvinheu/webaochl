import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/app/environments/environment.prod';
import { Subscription, from } from 'rxjs';
import { DanhMuc } from 'src/app/models/danhmuc';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DanhmucService } from '../../service/danhmuc.service';
import { SanphamService } from '../../service/sanpham.service';
import { ResultValidatorService } from '../../service/result-validator.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SanphamComponent } from '../sanpham.component';
import { ImageValidator } from 'src/app/myvalidator/image.validator';
import { NhacungcapService } from '../../service/nhacungcap.service';
import { Nhacungcap } from 'src/app/models/nhacungcap';
// import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { element } from 'protractor';


@Component({
    selector: 'app-sanpham-add',
    templateUrl: './sanpham-add.component.html',
    styleUrls: ['./sanpham-add.component.sass']
})
export class SanphamAddComponent implements OnInit, OnDestroy {
    // public Editor = ClassicEditor;    
    api_url = environment.api_img;
    subscriptions: Subscription[] = [];
    danhmucs: DanhMuc[];
    danhmucShows:DanhMuc[];
    danhmucAdds;
    nhacungcaps:Nhacungcap[];
    catalogSt;   
    frmAdd: FormGroup;
    file: File;
    filename = '';
    ckeConfig: any;    
    is_loading = false;    
    constructor(        
        private danhmucService: DanhmucService,
        private sanphamService: SanphamService,
        private nhacungcapService: NhacungcapService,
        private _formBuilder: FormBuilder,
        private resultValidatorService: ResultValidatorService,
        public dialogRef: MatDialogRef<SanphamComponent>
    ) { }
    loadEditor() {
        this.ckeConfig = {
            customConfig: 'custom/config.js'
        };
    }
    ngOnInit() {        
        this.nhacungcapService.getAll();    
        this.loadData();   
        //this.loadEditor();       
        this.createForm();           
             
    }
    loadData() {
        this.subscriptions.push(
            this.danhmucService.itemsObs.subscribe(
                data => {
                    this.danhmucs = data;
                    this.danhmucShows=[]; 
                    for (let index = 0; index < this.danhmucs.length; index++) {
                      const element = this.danhmucs[index];     
                        if(element.danhMuccha){                           
                          const peopleArraya =this.danhmucs[index];                                                 
                          this.danhmucShows.push(peopleArraya); 
                        }                                              
                    }                     
                },
                () => { }
            ), 
            this.nhacungcapService.itemsObs.subscribe(               
                data=>{
                    if(JSON.parse(localStorage.getItem('currentUser'))['idQuyen']==1){
                    this.nhacungcaps=data;  
                    }
                    else if(JSON.parse(localStorage.getItem('currentUser'))['idQuyen']==2){
                        this.nhacungcaps=[];
                            for (let index = 0; index < data.length; index++) {
                                const element = data[index];   
                                if(element.id==JSON.parse(localStorage.getItem('nhacungcap'))['id']){                           
                                    const peopleArraya =data[index];                                                 
                                    this.nhacungcaps.push(peopleArraya);                                                                 
                                }                                              
                            }                            
                    }
                }
            ),         
                      
            this.sanphamService.isLoadingObs.subscribe(data => {
                
                this.is_loading = data;
            }),
            
        );  
         
    }    
    createForm() {
        this.frmAdd = this._formBuilder.group({
            tenSanpham: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        '[ a-zA-Z1-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ' +
                        'ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ]*'
                    )
                ]
            ],
            gia: ['', [Validators.required]],           
            idDanhMuc: ['', [Validators.required]],
            soLuong: ['', [Validators.required]],
            idNhacungcap: ['', [Validators.required]],            
            hinhAnh: [
                '',
                [
                    Validators.required,
                    ImageValidator.imageSizeValidator(2000000),
                    ImageValidator.imageExtensionValidator([
                        'image/jpeg',
                        'image/png'
                    ])
                ]
            ],
            moTa: ['', [Validators.required]],
            thongTin: ['', [Validators.required]],
            
        });
    }

    onSubmitForm() {
        this.is_loading = true;
        const formData = new FormData();
        for (const key in this.frmAdd.value) {
            formData.append(key, this.frmAdd.value[key]);
        }
        this.sanphamService.createNew(formData);
    }
    ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.forEach(element => element.unsubscribe());
        }
    }
    onValidator(controlName: string, status?: boolean) {
        return this.resultValidatorService.getResult(
            controlName,
            this.frmAdd,
            status
        );
    }
    onValidatorBorderColor(controlName: string) {
        return this.resultValidatorService.getBorderColor(
            controlName,
            this.frmAdd
        );
    }
    onValidatorTextColor(controlName: string) {
        return this.resultValidatorService.getTextColor(
            controlName,
            this.frmAdd
        );
    }
    onFileChange(e) {
        if (e.target.files.length > 0) {
            this.file = e.target.files[0];
            this.filename = this.file.name;
            this.frmAdd.get('hinhAnh').setValue(this.file);
        }
    }
    onBack() {
        this.dialogRef.close();
    }
    
    
}
