import '@testing-library/jest-dom/extend-expect';
import { loadData, serializeData } from './battlefield-object-persister';

describe('loadData', () => {
    test('it should not try to load unknown data version', () => {
        const data = `#v0;Foo%20scenario;efdkhwwc,Coast,measurement,,368,119,0,0.000,0,a8,3b,ea,83;7t7twlbj,Coast,measurement,,522,303,0,0.000,0,ei,8f,er,e7;3iqxrymg,Kutaisi,airfield,,869,370,89,0.000,0,;ewa0ub1k,Target,airfield,,599,534,113,0.000,0,;la7i75ct,,bullseye,,592,530,-41,0.000,0,;csl3lezf,,stratofortress,,248,475,0,0.000,400,6w,d7,6w,cm;q5empa6k,,stratofortress,,283,492,3,0.000,400,7v,do,7w,d4;gfuvgl9w,,viper,,812,379,93,0.000,400,nx,a8,nb,a7,mq,a5,m4,a0,lp,9n,lg,94,lh,8j,lr,7y,m5,7l,mq,7c,na,78,nr,6w,o2,6f,o3,5v,nv,5b,nh,4x,mw,4o,m9,4n,ln,4o,l2,4q,kg,4q,jv,4n,ja,4h,iq,49,i6,41,hl,3t,gz,3p,gd,3n,fp,3m,f2,3m,eg,3m,dp,3l,cz,3j,ce,3i,bt,3f,b8,3a,ar,2y,af,2g,ac,1v,ah,1a,au,t,bd,i,bx,g,ci,l,cz,v,dg,19,dy,1o,ee,21,ex,2c,fg,2l,g3,2x,go,3a,h3,3n,hf,44,hn,4n,hn,57,hf,5r,gz,66,gf,6d,fu,6c,fa,63,ev,5p,ek,56,e9,4m,dx,44,dj,3o,d3,39,cm,2v,c6,2h,bn,23,b4,1t,al,1n,9z,1j,9e,1g,8s,1i,87,1q,7q,23,7f,2m,7a,38,7c,3u,7h,4f,7n,50,7r,5k,7r,68,7o,6t,7l,7g,7m,80,7s,8k,83,92,8i,9g,8y,9t,9g,a5,9x,ah,ac,av,aq,b9,b4,bp,bi,c6,bs,cp,by,d8,c0,ds,c5,ec,cg,eu,cw,f7,dg,fe,e4,fg,er,fd,fa,f7,ft,f1,gc,eu,gx,em,hg,ef,i0,e8,im,e3,j8,e5,jt,ec,k9,eq,kk,f8,kp,fs,ko,gd,ki,h0,k8,hj,ju,hx,ja,i9,ir,ie,i2,ih,hh,ig,gu,if,g9,ie,fo,ic,f4,ia,ek,i3,e4,hq,du,h6,ds,gj,dz,g0,ed,fl,ev,fb,ff,f7,g0,f5,gk,ex,h1,el,hh,e6,hu,dq,i6,d8,ih,cp,io,c7,ix,bo,j9,b7,jq,as,k8,aj,ks,ae,le,ae,m1,ah,mn,aj,n8,aj,nt,ag;ufz0wj9m,Mountain range,measurement,,552,24,0,0.000,0,fc,o,z9,27;dkdzajvv,Exit north,label,,881,245,0,2.813,0,;xtaz21d3,Practice raygun + buddyspike,label,,429,33,0,9.846,0,;xukph6vs,Channel switch,label,,821,176,0,3.383,0,;s2k4s6z8,Possible engagement,label,,299,259,0,20.585,0,;4aiu7ym3,,mk82,expl_m,579,535,76,26.002,300,ez,f5,fj,f0,g3,ev;uhilcskx,,mk82,expl_m,581,535,68,26.002,300,f3,fb,fm,f3,g5,ev;7lfvpkiq,,mk82,expl_m,582,538,70,33.275,300,el,fl,f4,fd,fn,f5,g6,ey;96p9bqu0,,mk82,expl_m,592,524,66,33.275,300,ed,fj,ew,fa,fe,f1,fx,et,gg,ek;hi7phg0i,2-ship CCIP attacks,label,,465,581,0,25.337,0,;netzj81y,Overhead break, land,label,,926,377,0,37.501,0,`;
        expect(() => loadData(data)).toThrow();
    });
    test('it should be able to load version 1 data', () => {
        const data = `#v1;Foo%20scenario;efdkhwwc,Coast,measurement,,368,119,0,0.000,0,a8,3b,ea,83;7t7twlbj,Coast,measurement,,522,303,0,0.000,0,ei,8f,er,e7;3iqxrymg,Kutaisi,airfield,,869,370,89,0.000,0,;ewa0ub1k,Target,airfield,,599,534,113,0.000,0,;la7i75ct,,bullseye,,592,530,-41,0.000,0,;csl3lezf,,stratofortress,,248,475,0,0.000,400,6w,d7,6w,cm;q5empa6k,,stratofortress,,283,492,3,0.000,400,7v,do,7w,d4;gfuvgl9w,,viper,,812,379,93,0.000,400,nx,a8,nb,a7,mq,a5,m4,a0,lp,9n,lg,94,lh,8j,lr,7y,m5,7l,mq,7c,na,78,nr,6w,o2,6f,o3,5v,nv,5b,nh,4x,mw,4o,m9,4n,ln,4o,l2,4q,kg,4q,jv,4n,ja,4h,iq,49,i6,41,hl,3t,gz,3p,gd,3n,fp,3m,f2,3m,eg,3m,dp,3l,cz,3j,ce,3i,bt,3f,b8,3a,ar,2y,af,2g,ac,1v,ah,1a,au,t,bd,i,bx,g,ci,l,cz,v,dg,19,dy,1o,ee,21,ex,2c,fg,2l,g3,2x,go,3a,h3,3n,hf,44,hn,4n,hn,57,hf,5r,gz,66,gf,6d,fu,6c,fa,63,ev,5p,ek,56,e9,4m,dx,44,dj,3o,d3,39,cm,2v,c6,2h,bn,23,b4,1t,al,1n,9z,1j,9e,1g,8s,1i,87,1q,7q,23,7f,2m,7a,38,7c,3u,7h,4f,7n,50,7r,5k,7r,68,7o,6t,7l,7g,7m,80,7s,8k,83,92,8i,9g,8y,9t,9g,a5,9x,ah,ac,av,aq,b9,b4,bp,bi,c6,bs,cp,by,d8,c0,ds,c5,ec,cg,eu,cw,f7,dg,fe,e4,fg,er,fd,fa,f7,ft,f1,gc,eu,gx,em,hg,ef,i0,e8,im,e3,j8,e5,jt,ec,k9,eq,kk,f8,kp,fs,ko,gd,ki,h0,k8,hj,ju,hx,ja,i9,ir,ie,i2,ih,hh,ig,gu,if,g9,ie,fo,ic,f4,ia,ek,i3,e4,hq,du,h6,ds,gj,dz,g0,ed,fl,ev,fb,ff,f7,g0,f5,gk,ex,h1,el,hh,e6,hu,dq,i6,d8,ih,cp,io,c7,ix,bo,j9,b7,jq,as,k8,aj,ks,ae,le,ae,m1,ah,mn,aj,n8,aj,nt,ag;ufz0wj9m,Mountain range,measurement,,552,24,0,0.000,0,fc,o,z9,27;dkdzajvv,Exit north,label,,881,245,0,2.813,0,;xtaz21d3,Practice raygun + buddyspike,label,,429,33,0,9.846,0,;xukph6vs,Channel switch,label,,821,176,0,3.383,0,;s2k4s6z8,Possible engagement,label,,299,259,0,20.585,0,;4aiu7ym3,,mk82,expl_m,579,535,76,26.002,300,ez,f5,fj,f0,g3,ev;uhilcskx,,mk82,expl_m,581,535,68,26.002,300,f3,fb,fm,f3,g5,ev;7lfvpkiq,,mk82,expl_m,582,538,70,33.275,300,el,fl,f4,fd,fn,f5,g6,ey;96p9bqu0,,mk82,expl_m,592,524,66,33.275,300,ed,fj,ew,fa,fe,f1,fx,et,gg,ek;hi7phg0i,2-ship CCIP attacks,label,,465,581,0,25.337,0,;netzj81y,Overhead break, land,label,,926,377,0,37.501,0,`;
        
        const { scenarioName, loadedObjects } = loadData(data);

        expect(scenarioName).toEqual('Foo scenario');
        expect(loadedObjects.length).toEqual(19);
        expect(loadedObjects[0].type).toEqual('measurement');
        expect(loadedObjects[0].name).toEqual('Coast');
        expect(loadedObjects[loadedObjects.length - 1].name).toEqual('Overhead break'); // Due to known bug with comma handling
    });

    
    test('it should be able to serialize to most recent data version', () => {
        const data = `#v2;;;4pyvc0wg~New~measurement~~247~146~0~0.000~0~_6v__42__3o_n;7q6k0u89~Foo~label~~469~216~270~0.000~0~;tw0tynwg~~viper~~261~320~88~0.000~400~_79__8w_:m8m/n!s?z55w6;9pmxgl4x~~bullseye~~289~455~-46~0.000~0~`;
        const { loadedObjects } = loadData(data);

        // Scenario name and map currently disappears in process
        const expected = `v2;;;4pyvc0wg~New~measurement~~247~146~0~0.000~0~_6v__42__3o_n;7q6k0u89~Foo~label~~469~216~270~0.000~0~;tw0tynwg~~viper~~261~320~88~0.000~400~_79__8w_:m8m/n!s?z55w6;9pmxgl4x~~bullseye~~289~455~-46~0.000~0~`;
        const serialized = serializeData(loadedObjects);

        expect(serialized).toEqual(expected);
    });
});
