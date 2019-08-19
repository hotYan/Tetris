/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50162
 Source Host           : localhost:3306
 Source Schema         : mydatabase

 Target Server Type    : MySQL
 Target Server Version : 50162
 File Encoding         : 65001

 Date: 08/06/2018 00:30:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_Id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `Phone` varchar(20)  NOT NULL COMMENT '手机号',
  `Password` varchar(100)  NOT NULL COMMENT '密码',
  `Name` varchar(20)  NOT NULL COMMENT '昵称',
  `Age` varchar(20)  NOT NULL COMMENT '年龄',
  `Sex` varchar(20)  NOT NULL COMMENT '性别',
  `Address` varchar(20)  NOT NULL COMMENT '地址',
  `Total` varchar(20)  NULL DEFAULT '0' COMMENT '消行数',
  `WinRate` varchar(20)  NULL DEFAULT '0' COMMENT '最高分数',
  PRIMARY KEY (`user_Id`) USING BTREE,
  UNIQUE KEY `user_phone`(`Phone`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = gb2312 COLLATE = gb2312_chinese_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1,'15823566420', '123456','杆杆菌0丫', '18', '女', '重庆','0' ,'0' );
INSERT INTO `user` VALUES (2,'15823566421', '123456','杆杆菌1丫', '18', '女', '重庆','0' ,'0');
INSERT INTO `user` VALUES (3,'15823566422', '123456','杆杆菌2丫', '18', '女', '重庆','0' ,'0');

-- ----------------------------
-- Table structure for recordo
-- ----------------------------
DROP TABLE IF EXISTS `orecord`;
CREATE TABLE `orecord`  (
  `or_Id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '单机战绩ID',
  `Phone` varchar(20) NOT NULL  COMMENT '手机号',
  `Time` varchar(200)  NOT NULL COMMENT '游戏结束时间',
  `Line` varchar(20)  NULL DEFAULT '0' COMMENT '消行数',
  `Score` varchar(20)  NULL DEFAULT '0' COMMENT '分数',
  PRIMARY KEY (`or_Id`) USING BTREE,
  KEY `or_user`(`Phone`) USING BTREE,
  KEY `or_score`(`Score`) USING BTREE,
  KEY `or_Line`(`Line`) USING BTREE,
  CONSTRAINT `orecord_1` FOREIGN KEY (`Phone`) REFERENCES `user` (`Phone`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = gb2312 COLLATE = gb2312_chinese_ci  ROW_FORMAT = Compact;

-- ----------------------------
-- Records of orecord
-- ----------------------------
INSERT INTO `orecord` VALUES (1,'1', '2018-06-01', '10','800');
-- 消行为空
INSERT INTO `orecord` VALUES (2,'1', '2018-06-01', '10','600');
-- 分数为空
INSERT INTO `orecord` VALUES (3,'1', '2018-06-01', '10','400');

-- ----------------------------
-- Table structure for trecord
-- ----------------------------
DROP TABLE IF EXISTS `trecord`;
CREATE TABLE `trecord`  (
  `tr_Id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '实时战绩ID',
  `Phone` varchar(200)  NOT NULL  COMMENT '手机号',
  `RPhone` varchar(200)  NOT NULL  COMMENT '对手手机号',
  `Time` varchar(200)  NOT NULL COMMENT '游戏结束时间',
  `Victory` int(10)  NOT NULL COMMENT '胜负',
  PRIMARY KEY (`tr_Id`) USING BTREE
  -- KEY `tr_user`(`Phone`) USING BTREE,
  -- CONSTRAINT `trecore_2` FOREIGN KEY (`Phone`) REFERENCES `user` (`Phone`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = gb2312 COLLATE = gb2312_chinese_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of trecord
-- ----------------------------
INSERT INTO `trecord` VALUES (1, '1', '2', '2018-06-07', 1);
INSERT INTO `trecord` VALUES (2, '1', '2', '2018-06-07', 0);
INSERT INTO `trecord` VALUES (3, '1', '2', '2018-06-07', 0);


SET FOREIGN_KEY_CHECKS = 1;
